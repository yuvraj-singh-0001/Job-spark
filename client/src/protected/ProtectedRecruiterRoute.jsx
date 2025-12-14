import { Navigate } from "react-router-dom";
import { useRecruiterProfile } from "../hooks/useRecruiterProfile";

/**
 * Protected route that checks if recruiter profile is complete
 * Redirects to profile form if incomplete
 */
export default function ProtectedRecruiterRoute({ children }) {
  const { loading, isComplete } = useRecruiterProfile();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isComplete) {
    return <Navigate to="/recruiter-profile-form" replace />;
  }

  return children;
}

