import React, { useState, useEffect } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import CandidateSidebar from './CandidateSidebar.jsx';
import api from '../../../components/apiconfig/apiconfig';

/**
 * Candidate Layout - For user/candidate dashboard pages
 * Includes Sidebar for navigation
 */
const CandidateLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [userData, setUserData] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await api.get('/auth/authcheck');
      if (response.data?.user) {
        setUserData(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
    }
  };

  const getUserInitial = () => {
    if (userData?.full_name) {
      return userData.full_name.charAt(0).toUpperCase();
    }
    return userData?.username?.charAt(0).toUpperCase() || 'U';
  };

  const handleLogout = async () => {
    try {
      await api.post('/auth/logout');
      localStorage.removeItem('token');
      navigate('/sign-in');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Mobile Header */}
      <header className="md:hidden fixed inset-x-0 top-0 z-20 bg-white border-b border-slate-200">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
            className="p-2 rounded-lg hover:bg-slate-100"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <span className="font-semibold">HireSpark</span>
          <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-medium">
            {getUserInitial()}
          </div>
        </div>
      </header>

      <div className="min-h-screen flex md:pt-0 pt-16">
        {/* Sidebar */}
        <CandidateSidebar 
          sidebarOpen={true}
          mobileSidebarOpen={mobileSidebarOpen}
          userData={userData}
          onToggleSidebar={() => {}}
          onLogout={handleLogout}
          currentPath={location.pathname}
          setMobileSidebarOpen={setMobileSidebarOpen}
        />

        {/* Main Content */}
        <main className="flex-1 flex flex-col md:ml-64">
          {/* Top Bar for Desktop */}
          <div className="hidden md:flex items-center justify-between px-8 py-4 border-b border-slate-200 bg-white">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">Dashboard</h2>
              <p className="text-xs text-slate-500 mt-1">Overview of your job search activity.</p>
            </div>
            <div className="flex items-center gap-3">
              <input
                type="text"
                placeholder="Search jobs..."
                className="px-3 py-1.5 text-sm border border-slate-200 rounded-lg bg-slate-50 focus:outline-none focus:ring-1 focus:ring-slate-400 w-48"
              />
              <div className="h-8 w-8 rounded-full bg-slate-200 flex items-center justify-center font-medium">
                {getUserInitial()}
              </div>
            </div>
          </div>

          {/* Page Content */}
          <section className="p-4 md:p-8">
            <Outlet />
          </section>
        </main>
      </div>
    </div>
  );
};

export default CandidateLayout;

