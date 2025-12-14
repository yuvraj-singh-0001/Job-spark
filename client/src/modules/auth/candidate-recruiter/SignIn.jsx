import { useState, useEffect, useCallback, useRef } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function SignIn() {
  const [searchParams] = useSearchParams();
  const roleParam = searchParams.get("role");
  const redirectParam = searchParams.get("redirect");

  const [role, setRole] = useState(roleParam === "recruiter" ? "recruiter" : "candidate");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);
  const location = useLocation();
  const handleGoogleSuccessRef = useRef(null);

  // Update role when query parameter changes
  useEffect(() => {
    if (roleParam === "recruiter") {
      setRole("recruiter");
    } else if (roleParam === "candidate") {
      setRole("candidate");
    }
  }, [roleParam]);

  // Decide where to send the user based on role + profile existence
  const resolveRedirect = useCallback(async (resolvedRole) => {
    try {
      if (resolvedRole === "recruiter") {
        // Recruiter profile exists?
        await api.get("/recruiter-profile/recruiter");
        // Profile exists - redirect to Post Job page (default dashboard view)
        return "/create-job";
      }

      // Candidate profile exists?
      await api.get("/profile/user");
      return "/dashboard";
    } catch (err) {
      // 404 means profile not created yet
      const status = err?.response?.status;
      if (status === 404) {
        // If coming from "post a job" flow and profile doesn't exist, go to profile form
        if (resolvedRole === "recruiter" && redirectParam === "post-job") {
          return "/recruiter-profile-form";
        }
        return resolvedRole === "recruiter"
          ? "/recruiter-profile-form"
          : "/dashboard/profile";
      }
      // Fallback to default destinations on other errors
      return resolvedRole === "recruiter" ? "/create-job" : "/dashboard";
    }
  }, [redirectParam]);

  const consumePostLoginTasks = useCallback(async (userRoleFallback) => {
    const getItem = (key) => {
      try {
        return window.localStorage.getItem(key);
      } catch {
        return null;
      }
    };

    const removeItem = (key) => {
      try {
        window.localStorage.removeItem(key);
      } catch {
        // ignore storage errors
      }
    };

    const pendingJobId = getItem("postLoginSaveJobId");
    const pendingApplyJobId = getItem("postLoginApplyJobId");
    const pendingRedirect = getItem("postLoginRedirect");

    // Handle save job flow
    if (pendingJobId) {
      try {
        await api.post(`/jobs/save/${pendingJobId}`);
        setMessage("Job saved successfully after sign-in.");
      } catch (err) {
        setMessage("Signed in, but we could not save the job automatically.");
      }
      removeItem("postLoginSaveJobId");
    }

    // Handle apply job flow (only for candidates)
    // Don't auto-apply, just redirect back to job page so user can click Apply Now manually
    if (pendingApplyJobId && userRoleFallback === "candidate") {
      // Check if profile exists and is complete
      let profileComplete = false;
      try {
        const profileRes = await api.get("/profile/user");
        if (profileRes?.data?.success && profileRes.data.user) {
          const profile = profileRes.data.user;
          const sessionRes = await api.get("/auth/session");
          const userEmail = sessionRes?.data?.user?.email;
          // Check if profile has required fields: name, email, and resume
          profileComplete = !!(
            profile.full_name &&
            userEmail &&
            profile.resume_path
          );
        }
      } catch (err) {
        // Profile doesn't exist or incomplete
        profileComplete = false;
      }

      if (!profileComplete) {
        // Profile incomplete - redirect to complete profile
        // Keep the apply job ID and redirect path for after profile completion
        // Don't remove them yet - profile page will handle the apply and cleanup
        return "/dashboard/profile";
      }

      // Profile is complete - just redirect back to job page
      // User will need to click Apply Now button manually
      removeItem("postLoginApplyJobId");
      if (pendingRedirect) {
        removeItem("postLoginRedirect");
        return pendingRedirect;
      }
      // Fallback: redirect to jobs page if no redirect path
      return "/jobs";
    }

    removeItem("postLoginRedirect");

    const fallbackRedirect = await resolveRedirect(userRoleFallback);
    const next =
      pendingRedirect ||
      location.state?.from?.pathname ||
      fallbackRedirect ||
      "/dashboard";

    return next;
  }, [resolveRedirect, location.state?.from?.pathname, setMessage]);

  // GOOGLE LOGIN SUCCESS HANDLER
  const handleGoogleSuccess = useCallback(async (response) => {
    if (!termsAccepted) {
      setError("Please accept the Terms & Conditions and Privacy Policy to continue.");
      return;
    }

    setLoading(true);
    setError("");
    setMessage("");

    try {
      console.log("Google sign-in: Sending credential to backend...");
      const { data } = await api.post("/auth/google", {
        credential: response.credential,
        role: role,
      });

      console.log("Google sign-in: Backend response received", data);
      const userRole = data?.user?.role || role;

      // Determine redirect path
      let redirectPath = null;

      try {
        redirectPath = await consumePostLoginTasks(userRole);
        console.log("Google sign-in: Post-login tasks completed, redirect path:", redirectPath);
      } catch (redirectErr) {
        console.error("Google sign-in: Error in post-login tasks", redirectErr);
        // Continue with fallback even if post-login tasks fail
      }

      // Ensure we always have a redirect path
      if (!redirectPath) {
        redirectPath = userRole === "recruiter" ? "/create-job" : "/dashboard";
        console.log("Google sign-in: Using fallback redirect path", redirectPath);
      }

      // Perform redirect - use replace to avoid adding to history
      console.log("Google sign-in: Redirecting to", redirectPath);
      // Use replace instead of href to avoid back button issues
      window.location.replace(redirectPath);
    } catch (err) {
      console.error("Google sign-in: Error", err);
      setError(err?.response?.data?.message || "Google login failed");
      setLoading(false);
    }
  }, [termsAccepted, role, consumePostLoginTasks]);

  // Keep ref updated
  useEffect(() => {
    handleGoogleSuccessRef.current = handleGoogleSuccess;
  }, [handleGoogleSuccess]);

  // LOAD GOOGLE BUTTON
  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing. Please set it in your .env file.");
      return;
    }

    // Wait for Google script to load
    let retryCount = 0;
    const maxRetries = 50; // 5 seconds max wait time
    const initializeGoogleAuth = () => {
      if (typeof window === "undefined" || !window.google || !window.google.accounts?.id) {
        retryCount++;
        if (retryCount < maxRetries) {
          // Retry after a short delay if script not loaded yet
          setTimeout(initializeGoogleAuth, 100);
        } else {
          console.error("Google Identity script failed to load after multiple retries.");
        }
        return;
      }

      try {
        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: (response) => {
            if (handleGoogleSuccessRef.current) {
              handleGoogleSuccessRef.current(response);
            }
          },
        });

        const buttonContainer = document.getElementById("google-login-btn");
        if (buttonContainer) {
          // Clear previous button if exists
          buttonContainer.innerHTML = "";
          window.google.accounts.id.renderButton(buttonContainer, {
            theme: "outline",
            size: "large",
            width: "100%",
            disabled: !termsAccepted,
          });
        }
      } catch (err) {
        console.error("Error initializing Google auth:", err);
      }
    };

    // Start initialization
    initializeGoogleAuth();
  }, [role, termsAccepted]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4 py-12">
      <div className="w-full max-w-6xl rounded-2xl bg-[#eefcfb] p-8 md:p-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="px-4 md:px-8">
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight text-slate-800">
              Talk to HR directly & get a job with better salary!
            </h1>
            <p className="mt-4 text-lg text-slate-500">Get local jobs in your city!</p>
          </div>

          <div className="flex justify-center">
            <div className="w-full max-w-md rounded-2xl shadow-lg bg-white border border-gray-200">
              <div className="px-8 pt-8 border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-semibold">Sign in to HireSpark</h2>
                <p className="mt-1 text-sm text-slate-500">Welcome back! Sign in with Google</p>
              </div>

              <div className="px-4 sm:px-6 pb-4 sm:pb-6 space-y-3 sm:space-y-4 pt-6">
                {/* Role Selection */}
                <div className="space-y-3">
                  <label className="block text-sm font-medium text-gray-700">
                    I want to sign in as:
                  </label>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <label className={`flex gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${role === "candidate" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <input
                        type="radio"
                        name="role"
                        value="candidate"
                        checked={role === "candidate"}
                        onChange={() => setRole("candidate")}
                        className="mt-0.5"
                      />
                      <span className="font-medium">Candidate</span>
                    </label>

                    <label className={`flex gap-2 p-3 border-2 rounded-xl cursor-pointer transition-colors ${role === "recruiter" ? "border-blue-500 bg-blue-50" : "border-gray-200 hover:border-gray-300"
                      }`}>
                      <input
                        type="radio"
                        name="role"
                        value="recruiter"
                        checked={role === "recruiter"}
                        onChange={() => setRole("recruiter")}
                        className="mt-0.5"
                      />
                      <span className="font-medium">Recruiter</span>
                    </label>
                  </div>
                </div>

                <div id="google-login-btn" className="flex justify-center"></div>

                {/* Terms & Conditions Checkbox */}
                <div className="flex items-start gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="terms-checkbox"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    className="mt-1 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                    required
                  />
                  <label htmlFor="terms-checkbox" className="text-xs text-gray-700 cursor-pointer">
                    I agree to the{" "}
                    <Link to="/terms" target="_blank" className="text-blue-600 hover:underline">
                      Terms & Conditions
                    </Link>{" "}
                    and{" "}
                    <Link to="/privacy" target="_blank" className="text-blue-600 hover:underline">
                      Privacy Policy
                    </Link>{" "}
                    of HireSpark.
                  </label>
                </div>

                {message && <p className="text-green-600 text-sm text-center">{message}</p>}
                {error && <p className="text-red-600 text-sm text-center">{error}</p>}

                <p className="text-sm text-center">
                  No account? <a className="text-slate-800 hover:underline" href="/sign-up">Create one</a>
                </p>

              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
