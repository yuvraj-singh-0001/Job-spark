import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../../../components/apiconfig/apiconfig";

export default function JobApplicants() {
  const { jobId } = useParams();
  const [applicants, setApplicants] = useState([]);
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedDetails, setExpandedDetails] = useState({});
  const [showRejectModal, setShowRejectModal] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'applied', 'shortlisted', 'rejected'
  const [shortlistingIds, setShortlistingIds] = useState(new Set()); // Track applications being shortlisted
  const [rejectingIds, setRejectingIds] = useState(new Set()); // Track applications being rejected

  // Helper function to validate URLs
  const isValidUrl = (url) => {
    if (!url || typeof url !== 'string') return false;
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  };

  // Helper function to calculate age from date of birth
  const calculateAge = (dateOfBirth) => {
    if (!dateOfBirth) return null;

    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    // If birthday hasn't occurred this year yet, subtract 1
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    return age;
  };

  // Helper function to convert text to sentence case
  const toSentenceCase = (text) => {
    if (!text || typeof text !== 'string') return text;

    // Convert to lowercase and trim
    let result = text.trim().toLowerCase();

    // Capitalize first letter of the text
    result = result.replace(/^./, (char) => char.toUpperCase());

    // Capitalize first letter after each period followed by space
    result = result.replace(/\. +([a-z])/g, (match, letter) => `. ${letter.toUpperCase()}`);

    return result;
  };

  useEffect(() => {
    if (jobId) {
      fetchApplicants();
    }
  }, [jobId]);


  const fetchApplicants = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/recruiter/jobs/${jobId}/applicants`);
      if (data.ok) {
        const fetchedApplicants = data.applicants;
        setApplicants(fetchedApplicants);

        // Also fetch job details
        const jobData = await api.get("/recruiter/jobs");
        if (jobData.data.ok) {
          const currentJob = jobData.data.jobs.find(j => j.id === parseInt(jobId));
          setJob(currentJob);
        }
      } else {
        setError("Failed to fetch applicants");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch applicants");
      console.error("Error fetching applicants:", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusInfo = (status) => {
    const statusMap = {
      applied: {
        label: 'New Applicant',
        color: 'bg-blue-100 text-blue-800 border border-blue-200'
      },
      shortlisted: {
        label: 'Shortlisted',
        color: 'bg-green-100 text-green-800 border border-green-200'
      },
      rejected: {
        label: 'Rejected',
        color: 'bg-red-100 text-red-800 border border-red-200'
      }
    };
    return statusMap[status] || {
      label: status.charAt(0).toUpperCase() + status.slice(1),
      color: 'bg-gray-100 text-gray-800 border border-gray-200'
    };
  };

  const getAvailabilityText = (availability) => {
    if (!availability) return "Availability not specified";

    const availabilityMap = {
      'Immediately': 'Can join immediately',
      'Within 7 Days': 'Can join in 7 days',
      'Within 15 Days': 'Can join in 15 days'
    };

    return availabilityMap[availability] || `Can join ${availability}`;
  };

  const toggleDetails = (applicationId) => {
    setExpandedDetails(prev => ({
      ...prev,
      [applicationId]: !prev[applicationId]
    }));
  };

  const handleCall = (applicant) => {
    if (applicant.user.phone) {
      window.location.href = `tel:${applicant.user.phone}`;
    }
  };

  const handleWhatsApp = (applicant) => {
    if (applicant.user.phone) {
      const phoneNumber = applicant.user.phone.replace(/\D/g, ''); // Remove non-digits
      const message = encodeURIComponent(`Hello ${applicant.user.fullName}, I'm calling regarding your job application.`);
      window.open(`https://wa.me/${phoneNumber}?text=${message}`, '_blank');
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus, interviewData = null) => {
    try {
      const payload = { status: newStatus };
      if (interviewData) {
        payload.interviewDate = interviewData.date;
        payload.interviewTime = interviewData.time;
        payload.interviewMessage = interviewData.message;
      }

      const { data } = await api.put(
        `/recruiter/jobs/applications/${applicationId}/status`,
        payload
      );

      if (data.ok) {
        setApplicants(prev => prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: newStatus, updatedAt: new Date().toISOString() }
            : app
        ));
        if (showRejectModal) {
          setShowRejectModal(null);
        }
        return true;
      }
      return false;
    } catch (err) {
      console.error("Error updating status:", err);
      alert(err.response?.data?.message || "Failed to update status. Please try again.");
      return false;
    }
  };

  const handleShortlist = async (applicationId) => {
    if (shortlistingIds.has(applicationId)) return; // Prevent duplicate clicks

    setShortlistingIds(prev => new Set(prev).add(applicationId));

    try {
      const success = await updateApplicationStatus(applicationId, 'shortlisted');
      if (success) {
        // Update UI immediately for better UX
        setApplicants(prev => prev.map(app =>
          app.applicationId === applicationId
            ? { ...app, status: 'shortlisted', updatedAt: new Date().toISOString() }
            : app
        ));
      }
    } finally {
      setShortlistingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleReject = async (applicationId) => {
    if (rejectingIds.has(applicationId)) return; // Prevent duplicate clicks

    setRejectingIds(prev => new Set(prev).add(applicationId));

    try {
      await updateApplicationStatus(applicationId, 'rejected');
    } finally {
      setRejectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(applicationId);
        return newSet;
      });
    }
  };

  const handleCallNowClick = (applicant) => {
    // Just make the call directly
    handleCall(applicant);
  };

  // Get filtered applicants based on status filter
  const getFilteredApplicants = () => {
    if (statusFilter === 'all') return applicants;
    return applicants.filter(applicant => applicant.status === statusFilter);
  };

  const handleRejectApplication = async () => {
    if (!showRejectModal || rejectingIds.has(showRejectModal)) return;

    setRejectingIds(prev => new Set(prev).add(showRejectModal));

    try {
      const success = await updateApplicationStatus(showRejectModal, 'rejected');
      if (success) {
        setShowRejectModal(null); // Close modal on success
      }
    } finally {
      setRejectingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(showRejectModal);
        return newSet;
      });
    }
  };

  const viewResume = (resumePath, applicantName) => {
    if (resumePath) {
      // Construct full URL similar to candidate profile
      let resumeUrl = resumePath;
      if (!resumeUrl.startsWith('http')) {
        const resumePathNormalized = resumeUrl.startsWith('/') ? resumeUrl : `/${resumeUrl}`;
        resumeUrl = `${window.location.origin}${resumePathNormalized}`;
      }
      // Open in new tab instead of downloading
      window.open(resumeUrl, '_blank');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-4">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        {[1, 2, 3].map((i) => (
          <div key={i} className="rounded-2xl bg-white border border-gray-200">
            <div className="py-4 px-6">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="mb-4">
        <Link to="/job-posted" className="text-blue-600 hover:text-blue-800 mb-4 inline-block">
          ← Back to Posted Jobs
        </Link>
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-900">
              Applicants for {job?.title || 'Job'}
            </h1>
            {job && (
              <p className="text-gray-600 mt-1 text-sm">
                {job.company} • {job.location} • {getFilteredApplicants().length} applicant{getFilteredApplicants().length !== 1 ? 's' : ''} {statusFilter !== 'all' && `(filtered from ${applicants.length} total)`}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Status Filter */}
      {applicants.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="p-4">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setStatusFilter('all')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                All ({applicants.length})
              </button>
              <button
                onClick={() => setStatusFilter('applied')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'applied'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Applied ({applicants.filter(a => a.status === 'applied').length})
              </button>
              <button
                onClick={() => setStatusFilter('shortlisted')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'shortlisted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Shortlisted ({applicants.filter(a => a.status === 'shortlisted').length})
              </button>
              <button
                onClick={() => setStatusFilter('rejected')}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${statusFilter === 'rejected'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
              >
                Rejected ({applicants.filter(a => a.status === 'rejected').length})
              </button>
            </div>
          </div>
        </div>
      )}

      {error && (
        <div className="rounded-md bg-red-50 p-4">
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {/* Reject Confirmation Modal */}
      {showRejectModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-4 max-w-sm w-full">
            <h3 className="text-base font-semibold mb-3">Reject Application</h3>
            <p className="text-gray-600 mb-4 text-sm">
              Are you sure you want to reject this application? This action cannot be undone.
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowRejectModal(null)}
                className="flex-1 px-3 py-2 text-xs font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleRejectApplication}
                disabled={showRejectModal && rejectingIds.has(showRejectModal)}
                className={`flex-1 px-3 py-2 text-xs font-medium rounded-lg transition-colors ${showRejectModal && rejectingIds.has(showRejectModal)
                  ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                  : 'text-white bg-red-600 hover:bg-red-700'
                  }`}
              >
                {showRejectModal && rejectingIds.has(showRejectModal) ? 'Rejecting...' : 'Reject'}
              </button>
            </div>
          </div>
        </div>
      )}

      {applicants.length === 0 ? (
        <div className="rounded-lg text-center py-8 bg-white border border-gray-200">
          <div className="px-4">
            <div className="text-gray-500 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">No applicants yet</h3>
            <p className="text-gray-600 text-sm">No one has applied to this job yet.</p>
          </div>
        </div>
      ) : getFilteredApplicants().length === 0 ? (
        <div className="rounded-lg text-center py-8 bg-white border border-gray-200">
          <div className="px-4">
            <div className="text-gray-500 mb-3">
              <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1.5">No {statusFilter} applications</h3>
            <p className="text-gray-600 text-sm">
              {statusFilter === 'applied' && "No new applications to review."}
              {statusFilter === 'shortlisted' && "No shortlisted candidates yet."}
              {statusFilter === 'rejected' && "No rejected applications."}
            </p>
            <button
              onClick={() => setStatusFilter('all')}
              className="mt-3 btn btn-primary btn-sm"
            >
              View All Applications
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {getFilteredApplicants().map((applicant) => {
            const statusInfo = getStatusInfo(applicant.status);
            const isExpanded = expandedDetails[applicant.applicationId];

            return (
              <div key={applicant.applicationId} className="rounded-lg hover:shadow-md transition-shadow bg-white border border-gray-200">
                <div className="py-4 px-3 sm:px-4">
                  <div className="flex flex-col gap-3">
                    {/* Header Row: Avatar, Name, Status */}
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-medium text-gray-600">
                          {applicant.user.fullName ? applicant.user.fullName.charAt(0).toUpperCase() : 'U'}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                          <h3 className="font-semibold text-base text-gray-900">
                            {applicant.user.fullName || 'Anonymous User'}
                          </h3>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                            {statusInfo.label}
                          </span>
                        </div>

                        {/* Primary Info: Phone, Location, Availability, Experience */}
                        <div className="space-y-1.5 text-xs">
                          {applicant.user.phone && (
                            <div className="font-semibold text-gray-900">
                              Phone: {applicant.user.phone}
                            </div>
                          )}
                          <div className="flex flex-wrap items-center gap-3 text-gray-700">
                            {applicant.user.dateOfBirth && (
                              <div className="text-sm text-gray-700">
                                <strong>Age:</strong> {calculateAge(applicant.user.dateOfBirth)} years
                              </div>
                            )}

                            {applicant.user.location && (
                              <div className="font-semibold">
                                Location: {applicant.user.location}
                              </div>
                            )}
                            {applicant.user.availability && (
                              <div className="text-green-600 font-medium">
                                {getAvailabilityText(applicant.user.availability)}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* More Details Toggle */}
                        <button
                          onClick={() => toggleDetails(applicant.applicationId)}
                          className="mt-2 text-xs text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1"
                        >
                          {isExpanded ? (
                            <>
                              <span>Less details</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              </svg>
                            </>
                          ) : (
                            <>
                              <span>More details</span>
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              </svg>
                            </>
                          )}
                        </button>

                        {/* Expanded Details Section */}
                        {isExpanded && (
                          <div className="mt-3 pt-3 border-t border-gray-200 space-y-2">
                            {/* 🎯 COVER LETTER - Most Important Content */}
                            {applicant.coverLetter && (
                              <div className="bg-blue-50 border-l-4 border-blue-400 p-3 rounded-r-lg">
                                <div className="text-xs">
                                  <strong className="text-blue-900 text-sm flex items-center gap-2">
                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zM9 9h2v2H9V9z" clipRule="evenodd" />
                                    </svg>
                                    Cover Letter
                                  </strong>
                                  <p className="mt-2 text-blue-800 whitespace-pre-line leading-relaxed">
                                    {toSentenceCase(applicant.coverLetter)}
                                  </p>
                                </div>
                              </div>
                            )}

                            {applicant.user.email && (
                              <div className="text-sm text-gray-700">
                                <strong>Email:</strong> {applicant.user.email}
                              </div>
                            )}
                            {applicant.user.highestEducation && (
                              <div className="text-sm text-gray-700">
                                <strong>Education:</strong> {applicant.user.highestEducation}
                              </div>
                            )}

                            {/* Additional Education Details */}
                            {applicant.user.tradeStream && (
                              <div className="text-sm text-gray-700">
                                <strong>Trade/Stream:</strong> {applicant.user.tradeStream}
                              </div>
                            )}






                            {/* Career Information */}
                            {applicant.user.experienceType && (
                              <div className="text-sm text-gray-700">
                                <strong>Experience Type:</strong> {applicant.user.experienceType}
                              </div>
                            )}

                            {applicant.resumePath && (
                              <button
                                onClick={() => viewResume(applicant.resumePath, applicant.user.fullName || 'applicant')}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                              >
                                View Resume
                              </button>
                            )}

                            {applicant.idProofPath && (
                              <button
                                onClick={() => viewResume(applicant.idProofPath, `${applicant.user.fullName || 'applicant'}_id_proof`)}
                                className="text-sm text-gray-600 hover:text-gray-800 underline"
                              >
                                View ID Proof
                              </button>
                            )}

                            <div className="text-sm text-gray-700">
                              <strong>Experience:</strong> {applicant.user.experienceYears === 0 ? 'Fresher' : `${applicant.user.experienceYears} years`}
                            </div>

                            {/* Social Links */}
                            <div className="flex gap-2 pt-1">
                              {applicant.user.linkedinUrl && isValidUrl(applicant.user.linkedinUrl) && (
                                <a
                                  href={applicant.user.linkedinUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-blue-600 hover:text-blue-800 text-sm font-medium"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                                  </svg>
                                  LinkedIn
                                </a>
                              )}
                              {applicant.user.githubUrl && isValidUrl(applicant.user.githubUrl) && (
                                <a
                                  href={applicant.user.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 text-gray-700 hover:text-gray-900 text-sm font-medium"
                                >
                                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                                  </svg>
                                  GitHub
                                </a>
                              )}
                            </div>
                          </div>
                        )}

                        <p className="text-xs text-gray-500 mt-2">
                          Applied on {formatDate(applicant.appliedAt)}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons Row */}
                    <div className="flex flex-col sm:flex-row gap-2 pt-3 border-t border-gray-200">
                      {/* Primary Actions: Call Now and WhatsApp */}
                      <div className="flex gap-2 flex-1">
                        {applicant.user.phone && (
                          <>
                            <button
                              onClick={() => handleCallNowClick(applicant)}
                              className="flex-1 sm:flex-none px-4 py-2 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                              </svg>
                              Call Now
                            </button>
                            <button
                              onClick={() => handleWhatsApp(applicant)}
                              className="px-4 py-2 text-xs font-semibold text-white bg-[#25D366] hover:bg-[#20BA5A] rounded-lg transition-colors flex items-center justify-center gap-1.5"
                            >
                              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
                              </svg>
                              WhatsApp
                            </button>
                          </>
                        )}
                      </div>

                      {/* Secondary Actions: Shortlist and Reject */}
                      <div className="flex gap-1.5">
                        {applicant.status === 'applied' && (
                          <button
                            onClick={() => handleShortlist(applicant.applicationId)}
                            disabled={shortlistingIds.has(applicant.applicationId)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${shortlistingIds.has(applicant.applicationId)
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : 'text-green-700 bg-green-50 hover:bg-green-100 border border-green-200'
                              }`}
                          >
                            {shortlistingIds.has(applicant.applicationId) ? (
                              <>
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 inline" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Shortlisting...
                              </>
                            ) : (
                              'Shortlist'
                            )}
                          </button>
                        )}
                        {applicant.status !== 'rejected' && (
                          <button
                            onClick={() => setShowRejectModal(applicant.applicationId)}
                            disabled={rejectingIds.has(applicant.applicationId)}
                            className={`px-3 py-2 text-xs font-medium rounded-lg transition-colors ${rejectingIds.has(applicant.applicationId)
                              ? 'bg-gray-400 text-gray-600 cursor-not-allowed'
                              : 'text-red-700 bg-red-50 hover:bg-red-100 border border-red-200'
                              }`}
                          >
                            {rejectingIds.has(applicant.applicationId) ? 'Rejecting...' : 'Reject'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}