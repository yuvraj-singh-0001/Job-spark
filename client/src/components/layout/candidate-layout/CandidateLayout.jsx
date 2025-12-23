import React from 'react';
import { Outlet } from 'react-router-dom';
import CandidateHeader from './CandidateHeader.jsx';
import { ToastContainer } from '../../toast';

/**
 * Candidate Layout - For user/candidate dashboard pages
 * Includes Header for navigation
 */
const CandidateLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <CandidateHeader />
      <main className="flex-1">
        <Outlet />
      </main>
      <ToastContainer />
    </div>
  );
};

export default CandidateLayout;

