import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children, roles }) {
  const location = useLocation();

  // JWT token set during login
  const token = localStorage.getItem("hs_token");

  // User info (role, id, etc.)
  const user = JSON.parse(localStorage.getItem("hs_user"));

  // If user is not logged in → redirect to sign-in
  if (!token) {
    return <Navigate to="/sign-in" state={{ from: location }} replace />;
  }

  // Optional role-based protection
  if (roles && user && !roles.includes(user.role)) {
    // If recruiter tries to access user-only page → redirect
    // If user tries to access recruiter page → redirect
    return <Navigate to="/dashboard" replace />;
  }

  // If everything is valid → show the page
  return children;
}
