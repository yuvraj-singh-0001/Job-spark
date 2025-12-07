import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import GuestNavbar from "./GuestNavbar.jsx";
import GuestFooter from "./GuestFooter.jsx";

/**
 * Guest Layout - For public pages (home, jobs, companies, etc.)
 * Includes Navbar and Footer (footer hidden on auth pages)
 */
const GuestLayout = () => {
  const { pathname } = useLocation();

  // Routes where we DON'T want to show the footer
  const noFooterRoutes = [
    "/sign-in",
    "/sign-up",
    "/forgot",
    "/sign-in-modal",
    "/admin/signin",
    "/admin/signup",
  ];

  const hideFooter =
    noFooterRoutes.includes(pathname) ||
    noFooterRoutes.some((p) => pathname.startsWith(p + "/"));

  return (
    <div className="min-h-screen flex flex-col">
      <header>
        <GuestNavbar />
      </header>

      <main className="flex-1">
        <Outlet />
      </main>

      {!hideFooter && (
        <footer>
          <GuestFooter />
        </footer>
      )}
    </div>
  );
};

export default GuestLayout;

