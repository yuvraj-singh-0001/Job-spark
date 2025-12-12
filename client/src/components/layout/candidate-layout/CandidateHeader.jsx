import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Sparkles, User } from 'lucide-react';
import api from '../../../components/apiconfig/apiconfig';

export default function CandidateHeader() {
  const [userData, setUserData] = useState(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    fetchUserData();
  }, []);

  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const formatCreatedDate = (u) => {
    if (!u) return '-';
    const d = u.created_at || u.createdAt || u.created || u.createdAtDate || u.createdAtUTC;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleDateString() : '-';
    } catch (e) {
      return '-';
    }
  };

  const formatLoginTime = (u) => {
    if (!u) return '-';
    const d = u.loginAt || u.last_login || u.lastLogin || u.loggedInAt;
    try {
      const date = d ? new Date(d) : null;
      return date ? date.toLocaleString() : '-';
    } catch (e) {
      return '-';
    }
  };

  const navItems = [
    { path: '/dashboard', label: 'Find Jobs' },
    { path: '/dashboard/saved', label: 'Saved Jobs' },
    { path: '/dashboard/applied', label: 'Applications' },
    { path: '/dashboard/profile', label: 'Profile' },
  ];

  const isActive = (path) => {
    if (path === '/dashboard') {
      return location.pathname === '/dashboard';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white text-slate-900 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10 py-3 md:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link to="/dashboard" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
            <div className="h-10 w-10 rounded-xl bg-blue-600 text-white grid place-items-center shadow-md">
              <Sparkles size={20} />
            </div>
            <span className="text-xl font-bold tracking-tight">
              Hire<span className="text-blue-600">Spark</span>
            </span>
          </Link>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive(item.path)
                    ? 'border-2 border-slate-900 text-slate-900'
                    : 'text-slate-700 hover:bg-slate-100'
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* User Profile Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            >
              <div className="h-9 w-9 rounded-full bg-slate-100 grid place-items-center text-sm font-semibold text-slate-700">
                {userData ? (
                  getUserInitial()
                ) : (
                  <User size={18} />
                )}
              </div>
            </button>

            {dropdownOpen && userData && (
              <div className="absolute right-0 mt-3 w-72 bg-white text-slate-900 rounded-xl shadow-2xl p-5 z-50 border border-slate-200">
                <div className="mb-4">
                  <div className="text-xs text-slate-500">Name</div>
                  <div className="font-semibold text-lg">
                    {userData.name || userData.full_name || userData.fullname || userData.username || '-'}
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-slate-500">Username</div>
                  <div className="font-medium text-sm">{userData.username || '-'}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-slate-500">Role</div>
                  <div className="font-medium text-sm">
                    <span className="font-bold">{userData.role || 'candidate'}</span>
                  </div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-slate-500">Member since</div>
                  <div className="font-medium text-sm">{formatCreatedDate(userData)}</div>
                </div>
                <div className="mb-4">
                  <div className="text-xs text-slate-500">Last login</div>
                  <div className="font-medium text-sm">{formatLoginTime(userData)}</div>
                </div>
                <div className="pt-4 border-t border-slate-200 space-y-3">
                  <Link
                    to="/dashboard/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="block w-full text-left px-4 py-3 rounded-lg border border-blue-200 text-blue-700 hover:bg-blue-50 transition-colors font-medium text-sm"
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
      </div>
    </header>
  );
}

