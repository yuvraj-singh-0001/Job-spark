import { useState, useEffect } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function PendingRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await api.get("/admin/auth/recruiters");
      // Filter only pending recruiters
      const pendingRecruiters = (response.data.recruiters || []).filter(
        recruiter => recruiter.verified === 0 || recruiter.verified === false
      );
      setRecruiters(pendingRecruiters);
    } catch (error) {
      console.error("Error fetching recruiters:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (recruiter) => {
    setSelectedRecruiter(recruiter);
    setShowModal(true);
  };

  const toggleVerification = async (recruiterId, currentVerified) => {
    try {
      // Always verify (set to 1) since this is pending recruiters page
      await api.put(`/admin/auth/recruiters/${recruiterId}/verify`, {
        verified: 1
      });
      
      // Remove from list immediately
      setRecruiters(prevRecruiters => 
        prevRecruiters.filter(recruiter => recruiter.user_id !== recruiterId)
      );
      
      // Refresh data
      fetchRecruiters();
    } catch (error) {
      console.error("Error updating verification:", error);
      alert("Failed to verify recruiter. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-full mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pending Recruiters</h1>
          <p className="text-sm md:text-base text-gray-600">
            Total {recruiters.length} recruiters waiting for verification
          </p>
        </div>
        <button
          onClick={fetchRecruiters}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
        >
          Refresh
        </button>
      </div>

      {/* Pending Recruiters Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 py-3 bg-blue-600 border-b border-blue-700">
          <h2 className="text-lg font-semibold text-white">
            Pending Verification ({recruiters.length})
          </h2>
          <p className="text-sm text-blue-100">
            Recruiters waiting for verification approval
          </p>
        </div>
        {recruiters.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Company
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Contact
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Type
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {recruiters.map((recruiter) => (
                  <tr key={recruiter.user_id} className="hover:bg-gray-50">
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[150px]">
                          {recruiter.company_name}
                        </div>
                        <div className="text-xs text-gray-500 truncate max-w-[150px]">
                          {recruiter.company_website && (
                            <a 
                              href={recruiter.company_website} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:underline"
                            >
                              {recruiter.company_website}
                            </a>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[120px]">{recruiter.email}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">@{recruiter.username}</div>
                    </td>
                    <td className="px-3 py-4 text-sm text-gray-900 capitalize hidden lg:table-cell">
                      {recruiter.company_type}
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[120px]">
                        {recruiter.city}, {recruiter.state}
                      </div>
                      <div className="text-xs text-gray-500 truncate max-w-[120px]">{recruiter.country}</div>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewDetails(recruiter)}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm px-2 py-1 rounded border border-blue-200 hover:bg-blue-50"
                        >
                          View
                        </button>
                        <button
                          onClick={() => toggleVerification(recruiter.user_id, recruiter.verified)}
                          className="text-green-600 hover:text-green-900 border border-green-200 hover:bg-green-50 text-xs sm:text-sm px-2 py-1 rounded"
                        >
                          Verify
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Recruiters</h3>
            <p className="text-gray-500">All recruiters have been verified</p>
          </div>
        )}
      </div>

      {/* Recruiter Details Modal */}
      {showModal && selectedRecruiter && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Recruiter Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Company Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Company Name</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedRecruiter.company_name}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Website</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {selectedRecruiter.company_website ? (
                          <a href={selectedRecruiter.company_website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                            {selectedRecruiter.company_website}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Company Type</label>
                      <p className="text-gray-900 text-sm md:text-base capitalize">{selectedRecruiter.company_type}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Verification Status</label>
                      <p className="text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          selectedRecruiter.verified === 1 || selectedRecruiter.verified === true
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {selectedRecruiter.verified === 1 || selectedRecruiter.verified === true ? 'Verified' : 'Pending Verification'}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Email</label>
                      <p className="text-gray-900 text-sm md:text-base break-all">{selectedRecruiter.email}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Username</label>
                      <p className="text-gray-900 text-sm md:text-base">@{selectedRecruiter.username}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Member Since</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {new Date(selectedRecruiter.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base md:text-lg font-semibold mb-3">Address</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <p className="text-gray-900 text-sm md:text-base">{selectedRecruiter.address_line1}</p>
                  {selectedRecruiter.address_line2 && (
                    <p className="text-gray-900 text-sm md:text-base">{selectedRecruiter.address_line2}</p>
                  )}
                  <p className="text-gray-900 text-sm md:text-base">
                    {[selectedRecruiter.city, selectedRecruiter.state, selectedRecruiter.country, selectedRecruiter.pincode]
                      .filter(Boolean).join(', ')}
                  </p>
                </div>
              </div>

              {selectedRecruiter.verification_notes && (
                <div className="mt-6">
                  <h3 className="text-base md:text-lg font-semibold mb-3">Verification Notes</h3>
                  <div className="bg-yellow-50 p-3 md:p-4 rounded-lg">
                    <p className="text-gray-900 text-sm md:text-base">{selectedRecruiter.verification_notes}</p>
                  </div>
                </div>
              )}

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    toggleVerification(selectedRecruiter.user_id, selectedRecruiter.verified);
                    setShowModal(false);
                  }}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm md:text-base"
                >
                  Verify
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}