import { useState, useEffect } from "react";
import api from "../../../components/apiconfig/apiconfig";

export default function PendingJobs() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [processingJobId, setProcessingJobId] = useState(null);
  const [notification, setNotification] = useState({ show: false, message: "", type: "" });

  useEffect(() => {
    fetchJobs();
  }, []);

  const showNotification = (message, type = "success") => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: "", type: "" });
    }, 3000);
  };

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const response = await api.get("/admin/auth/jobs?status=pending");
      setJobs(response.data.jobs || []);
    } catch (error) {
      console.error("Error fetching pending jobs:", error);
      showNotification("Failed to fetch pending jobs. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = (job) => {
    setSelectedJob(job);
    setShowModal(true);
  };

  const handleApprove = async (jobId, jobTitle) => {
    if (!window.confirm(`Are you sure you want to approve "${jobTitle}"?`)) {
      return;
    }
    await updateJobStatus(jobId, 'approved');
  };

  const handleRejectClick = (job) => {
    setSelectedJob(job);
    setRejectionReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!selectedJob) return;
    await updateJobStatus(selectedJob.id, 'rejected', rejectionReason);
    setShowRejectModal(false);
    setRejectionReason("");
  };

  const updateJobStatus = async (jobId, newStatus, reason = null) => {
    if (processingJobId === jobId) return; // Prevent double submission

    try {
      setProcessingJobId(jobId);

      const payload = { status: newStatus };
      if (reason && reason.trim()) {
        payload.rejection_reason = reason.trim();
      }

      const response = await api.put(`/admin/auth/jobs/${jobId}/status`, payload);

      // Optimize: Remove from list immediately without full refresh
      setJobs(prevJobs => prevJobs.filter(job => job.id !== jobId));

      // Show success message
      const action = newStatus === 'approved' ? 'approved' : 'rejected';
      showNotification(`Job ${action} successfully!`, "success");

      // Close modals if open
      if (showModal) setShowModal(false);
      if (showRejectModal) setShowRejectModal(false);

    } catch (error) {
      console.error("Error updating job status:", error);
      const errorMessage = error.response?.data?.message || "Failed to update job status. Please try again.";
      showNotification(errorMessage, "error");

      // Refresh on error to ensure consistency
      fetchJobs();
    } finally {
      setProcessingJobId(null);
    }
  };

  const formatExperience = (min, max) => {
    if (min == null && max == null) return "Fresher";
    if (min != null && max == null) return `${min}+ yrs`;
    if (min == null && max != null) return `Up to ${max} yrs`;
    return `${min}-${max} yrs`;
  };

  const formatSalary = (salary) => {
    if (!salary) return "Not specified";
    return salary;
  };

  const formatDate = (dateString) => {
    if (!dateString) return "Not specified";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
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
      {/* Notification Toast */}
      {notification.show && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg flex items-center gap-3 ${notification.type === "success"
            ? "bg-green-500 text-white"
            : "bg-red-500 text-white"
          }`}>
          <span>{notification.message}</span>
          <button
            onClick={() => setNotification({ show: false, message: "", type: "" })}
            className="text-white hover:text-gray-200"
          >
            ✕
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4 mb-6">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-gray-900">Pending Jobs</h1>
          <p className="text-sm md:text-base text-gray-600">
            Total {jobs.length} jobs waiting for approval
          </p>
        </div>
        <button
          onClick={fetchJobs}
          disabled={loading}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
        >
          {loading ? "Refreshing..." : "Refresh"}
        </button>
      </div>

      {/* Pending Jobs Table */}
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <div className="px-4 py-3 bg-yellow-600 border-b border-yellow-700">
          <h2 className="text-lg font-semibold text-white">
            Pending Approval ({jobs.length})
          </h2>
          <p className="text-sm text-yellow-100">
            Jobs waiting for admin approval
          </p>
        </div>
        {jobs.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Job Details
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Company
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden lg:table-cell">
                    Location
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden md:table-cell">
                    Posted
                  </th>
                  <th className="px-3 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {jobs.map((job) => (
                  <tr key={job.id} className="hover:bg-yellow-50">
                    <td className="px-3 py-4">
                      <div>
                        <div className="text-sm font-medium text-gray-900 truncate max-w-[200px]">
                          {job.title}
                        </div>
                        <div className="text-xs text-gray-500 capitalize">
                          {job.job_type} • {formatExperience(job.min_experience, job.max_experience)}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          Salary: {formatSalary(job.salary)}
                        </div>
                      </div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[150px]">{job.company}</div>
                      <div className="text-xs text-gray-500 truncate max-w-[150px]">{job.recruiter_email}</div>
                    </td>
                    <td className="px-3 py-4 hidden lg:table-cell">
                      <div className="text-sm text-gray-900 truncate max-w-[120px]">{job.location}</div>
                    </td>
                    <td className="px-3 py-4 hidden md:table-cell">
                      <div className="text-sm text-gray-900">
                        {formatDate(job.created_at)}
                      </div>
                    </td>
                    <td className="px-3 py-4 text-sm font-medium">
                      <div className="flex flex-col sm:flex-row gap-2">
                        <button
                          onClick={() => handleViewDetails(job)}
                          disabled={processingJobId === job.id}
                          className="text-blue-600 hover:text-blue-900 text-xs sm:text-sm px-2 py-1 rounded border border-blue-200 hover:bg-blue-50 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleApprove(job.id, job.title)}
                          disabled={processingJobId === job.id}
                          className="text-green-600 hover:text-green-900 border border-green-200 hover:bg-green-50 text-xs sm:text-sm px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
                        >
                          {processingJobId === job.id ? (
                            <>
                              <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-green-600"></div>
                              Processing...
                            </>
                          ) : (
                            "Approve"
                          )}
                        </button>
                        <button
                          onClick={() => handleRejectClick(job)}
                          disabled={processingJobId === job.id}
                          className="text-red-600 hover:text-red-900 border border-red-200 hover:bg-red-50 text-xs sm:text-sm px-2 py-1 rounded disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          Reject
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
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No Pending Jobs</h3>
            <p className="text-gray-500">All jobs have been reviewed</p>
          </div>
        )}
      </div>

      {/* Job Details Modal */}
      {showModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
            <div className="p-4 md:p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Job Details</h2>
                <button
                  onClick={() => setShowModal(false)}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Job Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Job Title</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.title}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Job Type</label>
                      <p className="text-gray-900 text-sm md:text-base capitalize">{selectedJob.job_type}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Vacancies</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.vacancies || 'Not specified'}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Experience Required</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {formatExperience(selectedJob.min_experience, selectedJob.max_experience)}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Salary</label>
                      <p className="text-gray-900 text-sm md:text-base">{formatSalary(selectedJob.salary)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Company & Location</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Company</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.company}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Location</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.location}</p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Posted By</label>
                      <p className="text-gray-900 text-sm md:text-base">{selectedJob.recruiter_email}</p>
                      {selectedJob.company_name && (
                        <p className="text-sm text-gray-600">({selectedJob.company_name})</p>
                      )}
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Status</label>
                      <p className="text-gray-900">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${selectedJob.status === 'approved' ? 'bg-green-100 text-green-800' :
                            selectedJob.status === 'rejected' ? 'bg-red-100 text-red-800' :
                              selectedJob.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {selectedJob.status.charAt(0).toUpperCase() + selectedJob.status.slice(1)}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-6">
                <h3 className="text-base md:text-lg font-semibold mb-3">Job Description</h3>
                <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                  <p className="text-gray-900 text-sm md:text-base whitespace-pre-line">
                    {selectedJob.description || 'No description provided.'}
                  </p>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Contact Information</h3>
                  <div className="space-y-2">
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Contact Email</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {selectedJob.contact_email ? (
                          <a href={`mailto:${selectedJob.contact_email}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_email}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                    <div>
                      <label className="text-xs md:text-sm font-medium text-gray-500">Contact Phone</label>
                      <p className="text-gray-900 text-sm md:text-base">
                        {selectedJob.contact_phone ? (
                          <a href={`tel:${selectedJob.contact_phone}`} className="text-blue-600 hover:underline">
                            {selectedJob.contact_phone}
                          </a>
                        ) : 'Not provided'}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-base md:text-lg font-semibold mb-3">Interview Address</h3>
                  <div className="bg-gray-50 p-3 md:p-4 rounded-lg">
                    <p className="text-gray-900 text-sm md:text-base whitespace-pre-line">
                      {selectedJob.interview_address || 'Not specified'}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    handleApprove(selectedJob.id, selectedJob.title);
                    setShowModal(false);
                  }}
                  disabled={processingJobId === selectedJob.id}
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center gap-2"
                >
                  {processingJobId === selectedJob.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    "Approve Job"
                  )}
                </button>
                <button
                  onClick={() => {
                    setShowModal(false);
                    handleRejectClick(selectedJob);
                  }}
                  disabled={processingJobId === selectedJob.id}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  Reject Job
                </button>
                <button
                  onClick={() => setShowModal(false)}
                  disabled={processingJobId === selectedJob.id}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Rejection Reason Modal */}
      {showRejectModal && selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-lg md:text-xl font-bold text-gray-900">Reject Job</h2>
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600 text-xl"
                >
                  ✕
                </button>
              </div>

              <div className="mb-4">
                <p className="text-sm text-gray-600 mb-2">
                  Are you sure you want to reject <span className="font-semibold">"{selectedJob.title}"</span>?
                </p>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Provide a reason for rejection (optional)..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-red-500 resize-none"
                  rows="4"
                />
              </div>

              <div className="flex flex-col sm:flex-row justify-end gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason("");
                  }}
                  disabled={processingJobId === selectedJob.id}
                  className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base"
                >
                  Cancel
                </button>
                <button
                  onClick={handleRejectConfirm}
                  disabled={processingJobId === selectedJob.id}
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed text-sm md:text-base flex items-center justify-center gap-2"
                >
                  {processingJobId === selectedJob.id ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Processing...
                    </>
                  ) : (
                    "Confirm Rejection"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}