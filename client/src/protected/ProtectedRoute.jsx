import { Navigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import api from "../components/apiconfig/apiconfig.jsx";

/**
 * ProtectedRoute Component
 * -------------------------
 * Purpose:
 *   - Protect pages that require authentication.
 *   - Optionally restrict pages to specific roles (e.g., "recruiter").
 *
 * Props:
 *   - children → The page/component to render if authenticated.
 *   - roles → (optional) Array of allowed roles. Example: ["recruiter"].
 *
 * Flow:
 *   1. Check user session by calling GET /auth/authcheck.
 *   2. If not logged in → redirect to login page.
 *   3. If logged in but role is not allowed → redirect to correct dashboard.
 *   4. If logged in + valid role → render protected content.
 */
export default function ProtectedRoute({ children, roles }) {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let alive = true;
    (async () => {
      try {
        const { data } = await api.get("/auth/authcheck");
        if (alive) setUser(data?.user || null);
      } catch (e) {
        if (alive) setUser(null);
      } finally {
        if (alive) setLoading(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, []);

  if (loading) return null;

  if (!user) {
    return <Navigate to="/sign-in" replace state={{ from: location }} />;
  }

  const role = user?.role;
  if (roles && roles.length > 0 && !roles.includes(role)) {
    const fallback = role === "recruiter" ? "/recruiter-dashboard" : "/dashboard";
    return <Navigate to={fallback} replace />;
  }

  // Authenticated + allowed role → Show protected content
  return children;
}
