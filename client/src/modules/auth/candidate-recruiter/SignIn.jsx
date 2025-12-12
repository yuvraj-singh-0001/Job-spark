import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function SignIn() {
  const [role, setRole] = useState("candidate");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const location = useLocation();

  // Decide where to send the user based on role + profile existence
  const resolveRedirect = async (resolvedRole) => {
    try {
      if (resolvedRole === "recruiter") {
        // Recruiter profile exists?
        await api.get("/recruiter-profile/recruiter");
        return "/recruiter-profile";
      }

      // Candidate profile exists?
      await api.get("/profile/user");
      return "/dashboard";
    } catch (err) {
      // 404 means profile not created yet
      const status = err?.response?.status;
      if (status === 404) {
        return resolvedRole === "recruiter"
          ? "/recruiter-profile-form"
          : "/dashboard/profile";
      }
      // Fallback to default destinations on other errors
      return resolvedRole === "recruiter" ? "/recruiter-profile" : "/dashboard";
    }
  };

  const consumePostLoginTasks = async (userRoleFallback) => {
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
    const pendingRedirect = getItem("postLoginRedirect");

    if (pendingJobId) {
      try {
        await api.post(`/jobs/save/${pendingJobId}`);
        setMessage("Job saved successfully after sign-in.");
      } catch (err) {
        setMessage("Signed in, but we could not save the job automatically.");
      }
    }

    removeItem("postLoginSaveJobId");
    removeItem("postLoginRedirect");

    const fallbackRedirect = await resolveRedirect(userRoleFallback);
    const next =
      pendingRedirect ||
      location.state?.from?.pathname ||
      fallbackRedirect ||
      "/dashboard";

    return next;
  };

  // GOOGLE LOGIN SUCCESS HANDLER
  const handleGoogleSuccess = async (response) => {
    setLoading(true);
    setError("");
    setMessage("");

    try {
      const { data } = await api.post("/auth/google", {
        credential: response.credential,
        role: role,
      });

      const userRole = data?.user?.role || role;
      const next = await consumePostLoginTasks(userRole);
      window.location.href = next;
    } catch (err) {
      setError(err?.response?.data?.message || "Google login failed");
    } finally {
      setLoading(false);
    }
  };

  // LOAD GOOGLE BUTTON
  useEffect(() => {
    // Make sure we are in the browser and the Google script has loaded
    if (typeof window === "undefined" || !window.google || !window.google.accounts?.id) {
      console.error("Google Identity script not loaded or window.google is undefined.");
      return;
    }

    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.error("VITE_GOOGLE_CLIENT_ID is missing. Please set it in your .env file.");
      return;
    }

    window.google.accounts.id.initialize({
      client_id: clientId,
      callback: handleGoogleSuccess,
    });

    const buttonContainer = document.getElementById("google-login-btn");
    if (buttonContainer) {
      window.google.accounts.id.renderButton(buttonContainer, {
        theme: "outline",
        size: "large",
        width: "100%",
      });
    }
  }, [role]);

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
