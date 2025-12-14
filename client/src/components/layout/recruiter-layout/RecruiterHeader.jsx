import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Sparkles, User } from "lucide-react";
import api from "../../../components/apiconfig/apiconfig";

/**
 * Recruiter Header - Matches the design from the image
 * Shows: Logo, Post a Job, Applications, Profile, User dropdown
 */
export default function RecruiterHeader() {
  const [user, setUser] = useState(null);
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    let mounted = true;

    async function fetchUser() {
      try {
        const res = await api.get("/auth/session");
        if (mounted) setUser(res.data.user || null);
      } catch (err) {
        if (mounted) setUser(null);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchUser();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  function formatCreatedDate(u) {
    if (!u) return "-";
    const d =
      u.created_at ||
      u.createdAt ||
      u.created ||
      u.createdAtDate ||
      u.createdAtUTC;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleDateString() : "-";
    } catch (e) {
      return "-";
    }
  }

  function formatLoginTime(u) {
    if (!u) return "-";
    const d = u.loginAt || u.last_login || u.lastLogin || u.loggedInAt;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleString() : "-";
    } catch (e) {
      return "-";
    }
  }

  async function handleLogout() {
    try {
      await api.post("/auth/logout");
      setUser(null);
      setOpen(false);
      navigate("/sign-in");
    } catch (err) {
      console.error("Logout failed", err);
    }
  }

  if (loading) {
    return (
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
          <div className="h-10 w-10 bg-gray-200 animate-pulse rounded-xl"></div>
        </div>
      </header>
    );
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 md:py-4 flex items-center justify-between">
        {/* Logo */}
        <div>
          <Link
            to="/recruiter-dashboard"
            className="flex items-center gap-3 hover:opacity-90 transition-opacity"
          >
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md">
              <Sparkles size={20} />
            </div>
            <b className="text-xl font-bold tracking-tight">
              Hire<span className="text-blue-600">Spark</span>
            </b>
          </Link>
        </div>

        {/* Center Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Link
            to="/create-job"
            className="px-4 py-2 rounded-lg border-2 border-blue-600 text-blue-600 font-semibold hover:bg-blue-50 transition-colors"
          >
            Post a Job
          </Link>
          <Link
            to="/job-posted"
            className="text-slate-700 font-medium hover:text-blue-600 transition-colors"
          >
            Applications
          </Link>
          <Link
            to="/recruiter-profile"
            className="text-slate-700 font-medium hover:text-blue-600 transition-colors"
          >
            Profile
          </Link>
        </nav>

        {/* User Icon & Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-2 p-1 rounded-full hover:bg-slate-100 transition-colors"
          >
            <div className="h-10 w-10 rounded-full bg-blue-100 grid place-items-center text-sm font-semibold text-blue-700">
              {user?.name || user?.username
                ? (user.name || user.username).charAt(0).toUpperCase()
                : <User size={18} />}
            </div>
          </button>

          {open && (
            <div className="absolute right-0 mt-3 w-72 bg-white text-slate-900 rounded-xl shadow-2xl p-5 z-50 border border-slate-200">
              <div className="mb-4">
                <div className="text-xs text-slate-500">Name</div>
                <div className="font-semibold text-lg">
                  {user?.name || user?.fullname || user?.username || "-"}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-slate-500">Username</div>
                <div className="font-medium text-sm">{user?.username || user?.email || "-"}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-slate-500">Role</div>
                <div className="font-medium text-sm">{user?.role || "-"}</div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-slate-500">Member since</div>
                <div className="font-medium text-sm">
                  {formatCreatedDate(user)}
                </div>
              </div>
              <div className="mb-4">
                <div className="text-xs text-slate-500">Last login</div>
                <div className="font-medium text-sm">
                  {formatLoginTime(user)}
                </div>
              </div>
              <div className="pt-4 border-t border-slate-200 space-y-3">
                <Link
                  to="/recruiter-profile"
                  onClick={() => setOpen(false)}
                  className="block w-full text-left px-4 py-3 rounded-lg border border-blue-600 text-blue-600 hover:bg-blue-50 transition-colors font-medium text-sm"
                >
                  View Profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-colors font-medium text-sm text-white"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

