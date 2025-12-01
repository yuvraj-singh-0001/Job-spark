import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../components/apiconfig/apiconfig";

export default function AdminRecruiters() {
  const [recruiters, setRecruiters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecruiter, setSelectedRecruiter] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [activeTab, setActiveTab] = useState("all"); // "all", "pending", "verified"
  const navigate = useNavigate();

  useEffect(() => {
    fetchRecruiters();
  }, []);

  const fetchRecruiters = async () => {
    try {
      const response = await api.get("/admin/auth/recruiters");
      setRecruiters(response.data.recruiters || []);
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

  const handleBack = () => {
    navigate("/admin-dashboard");
  };

  const toggleVerification = async (recruiterId, currentVerified) => {
    try {
      const currentVerifiedNum = currentVerified === true || currentVerified === 1 ? 1 : 0;
      const newVerifiedStatus = currentVerifiedNum === 1 ? 0 : 1;
      
      await api.put(`/admin/auth/recruiters/${recruiterId}/verify`, {
        verified: newVerifiedStatus
      });
      
      setRecruiters(prevRecruiters => 
        prevRecruiters.map(recruiter => 
          recruiter.user_id === recruiterId 
            ? { ...recruiter, verified: newVerifiedStatus }
            : recruiter
        )
      );
      
      fetchRecruiters();
    } catch (error) {
      console.error("Error updating verification:", error);
      alert("Failed to update verification status. Please try again.");
    }
  };

  // Filter recruiters based on active tab
  const filteredRecruiters = () => {
    switch(activeTab) {
      case "pending":
        return recruiters.filter(recruiter => 
          recruiter.verified === 0 || recruiter.verified === false
        );
      case "verified":
        return recruiters.filter(recruiter => 
          recruiter.verified === 1 || recruiter.verified === true
        );
      default:
        return recruiters;
    }
  };

  const getTabStats = () => {
    const total = recruiters.length;
    const verified = recruiters.filter(r => r.verified === 1 || r.verified === true).length;
    const pending = total - verified;
    
    return { total, verified, pending };
  };

  const stats = getTabStats();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-full mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
          <div>
            <button
              onClick={handleBack}
              className="flex items-center text-blue-600 hover:text-blue-700 mb-2"
            >
              ← Back to Dashboard
            </button>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">Manage Recruiters</h1>
            <p className="text-sm md:text-base text-gray-600">
              Total {stats.total} recruiters • {stats.verified} verified • {stats.pending} pending
            </p>
          </div>
          <button
            onClick={fetchRecruiters}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 w-full sm:w-auto"
          >
            Refresh
          </button>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-4 md:space-x-8 overflow-x-auto">
              <button
                onClick={() => setActiveTab("all")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "all"
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                All Recruiters ({stats.total})
              </button>
              <button
                onClick={() => setActiveTab("pending")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "pending"
                    ? "border-yellow-500 text-white bg-blue-800 rounded-t-lg px-3"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Pending Verification ({stats.pending})
              </button>
              <button
                onClick={() => setActiveTab("verified")}
                className={`whitespace-nowrap py-2 px-1 border-b-2 font-medium text-sm md:text-base ${
                  activeTab === "verified"
                    ? "border-blue-800 text-green-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
              >
                Verified ({stats.verified})
              </button>
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        <div className="space-y-6">
          {/* Pending Recruiters Table */}
          {activeTab === "pending" && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-4 py-3 bg-yellow-50 border-b border-yellow-100">
                <h2 className="text-lg font-semibold text-yellow-800">
                  Pending Verification ({stats.pending})
                </h2>
                <p className="text-sm text-yellow-600">
                  Recruiters waiting for verification approval
                </p>
              </div>
              {filteredRecruiters().length > 0 ? (
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
                      {filteredRecruiters().map((recruiter) => (
                        <tr key={recruiter.user_id} className="hover:bg-yellow-50">
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-yellow-100 mb-4">
                    <svg className="w-8 h-8 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Recruiters</h3>
                  <p className="text-gray-500">All recruiters have been verified</p>
                </div>
              )}
            </div>
          )}

          {/* Verified Recruiters Table */}
          {activeTab === "verified" && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-4 py-3 bg-blue-900 border-b border-green-100">
                <h2 className="text-lg font-semibold text-white">
                  Verified Recruiters ({stats.verified})
                </h2>
                <p className="text-sm text-what-blue-600">
                  Recruiters that have been approved for verification
                </p>
              </div>
              {filteredRecruiters().length > 0 ? (
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
                      {filteredRecruiters().map((recruiter) => (
                        <tr key={recruiter.user_id} className="hover:bg-green-50">
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
                                className="text-orange-600 hover:text-orange-900 border border-orange-200 hover:bg-orange-50 text-xs sm:text-sm px-2 py-1 rounded"
                              >
                                Unverify
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
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 mb-4">
                    <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Verified Recruiters</h3>
                  <p className="text-gray-500">Verify recruiters to see them listed here</p>
                </div>
              )}
            </div>
          )}

          {/* All Recruiters Table */}
          {activeTab === "all" && (
            <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
              <div className="px-4 py-3 bg-blue-50 border-b border-blue-100">
                <h2 className="text-lg font-semibold text-blue-800">
                  All Recruiters ({stats.total})
                </h2>
                <p className="text-sm text-blue-600">
                  Showing all recruiters with their verification status
                </p>
              </div>
              {filteredRecruiters().length > 0 ? (
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
                          Status
                        </th>
                        <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {filteredRecruiters().map((recruiter) => (
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
                          <td className="px-3 py-4">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                              recruiter.verified === 1 || recruiter.verified === true
                                ? 'bg-green-100 text-green-800' 
                                : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {recruiter.verified === 1 || recruiter.verified === true ? 'Verified' : 'Pending'}
                            </span>
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
                                className={`text-xs sm:text-sm px-2 py-1 rounded ${
                                  recruiter.verified === 1 || recruiter.verified === true
                                    ? 'text-orange-600 hover:text-orange-900 border border-orange-200 hover:bg-orange-50' 
                                    : 'text-green-600 hover:text-green-900 border border-green-200 hover:bg-green-50'
                                }`}
                              >
                                {recruiter.verified === 1 || recruiter.verified === true ? 'Unverify' : 'Verify'}
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
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No Recruiters Found</h3>
                  <p className="text-gray-500">There are no recruiters registered yet</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Recruiter Details Modal (same as before) */}
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
                  className={`px-4 py-2 rounded-lg text-sm md:text-base ${
                    selectedRecruiter.verified === 1 || selectedRecruiter.verified === true
                      ? 'bg-orange-600 text-white hover:bg-orange-700'
                      : 'bg-green-600 text-white hover:bg-green-700'
                  }`}
                >
                  {selectedRecruiter.verified === 1 || selectedRecruiter.verified === true ? 'Unverify' : 'Verify'}
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