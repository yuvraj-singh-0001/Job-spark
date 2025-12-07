import React from "react";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar.jsx";

/**
 * Admin Layout - For admin dashboard pages
 * Includes Sidebar for navigation
 */
const AdminLayout = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />

      <main className="flex-1 ml-64 p-6 transition-all duration-300">
        <Outlet />
      </main>
    </div>
  );
};

export default AdminLayout;

