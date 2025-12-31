import React from "react";
import { Outlet, Link, useLocation, Navigate } from "react-router-dom";
import RecruiterSidebar from "./RecruiterSidebar.jsx";
import RecruiterHeader from "./RecruiterHeader.jsx";
import ErrorBoundary from "../../ErrorBoundary";
import { ToastContainer } from "../../toast";
import { useRecruiterProfile } from "../../../hooks/useRecruiterProfile";

/**
 * Recruiter Layout - For recruiter dashboard pages
 * Shows header when profile is complete, profile form when incomplete
 */
export default function RecruiterLayout() {
  const location = useLocation();
  const { loading, isComplete } = useRecruiterProfile();
  const isProfileFormPage = location.pathname === "/recruiter-profile-form";

  // Check if current route is active for mobile tabs
  const isActive = (path) => {
    return location.pathname === path || location.pathname.startsWith(path + '/');
  };

  // Get page title based on current route
  const getPageTitle = () => {
    if (location.pathname === '/recruiter-dashboard') return 'Dashboard';
    if (location.pathname === '/job-posted') return 'Posted Jobs';
    if (location.pathname === '/create-job') return 'Create Job';
    if (location.pathname.includes('/applicants')) return 'Applicants';
    if (location.pathname === '/recruiter-profile') return 'Company Profile';
    if (location.pathname === '/recruiter-profile-form') return 'Complete Profile';
    return 'Recruiter Dashboard';
  };

  // Get page description based on current route
  const getPageDescription = () => {
    if (location.pathname === '/recruiter-dashboard') return 'Quick overview of your hiring activity.';
    if (location.pathname === '/job-posted') return 'Manage your job postings and applicants.';
    if (location.pathname === '/create-job') return 'Create a new job posting.';
    if (location.pathname.includes('/applicants')) return 'Review and manage applicants.';
    if (location.pathname === '/recruiter-profile') return 'Update your company profile and settings.';
    if (location.pathname === '/recruiter-profile-form') return 'Complete your company profile to get started.';
    return 'Manage your recruiting activities.';
  };

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If profile is not complete and not on profile form page, redirect to profile form
  if (!isComplete && !isProfileFormPage) {
    return <Navigate to="/recruiter-profile-form" replace />;
  }

  // If on profile form page, show form without header
  if (isProfileFormPage) {
    return (
      <div className="min-h-screen bg-slate-50">
        <ErrorBoundary>
          <Outlet />
        </ErrorBoundary>
        <ToastContainer />
      </div>
    );
  }

  // Profile is complete - show header layout
  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-900">
      {/* Header matching the image design */}
      <RecruiterHeader />

      {/* Main content */}
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <ErrorBoundary>
            <Outlet />
          </ErrorBoundary>
        </div>
      </main>
      <ToastContainer />
    </div>
  );
}

