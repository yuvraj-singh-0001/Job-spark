const pool = require("../../config/db");

async function getJobApplicants(req, res) {
  try {
    const recruiterId = req.user?.id;
    const jobId = req.params.jobId;

    if (!recruiterId) {
      return res.status(401).json({ ok: false, message: "Unauthorized" });
    }

    if (!jobId) {
      return res.status(400).json({ ok: false, message: "Job ID is required" });
    }

    // First verify the job belongs to this recruiter
    const [jobRows] = await pool.query(
      'SELECT id FROM jobs WHERE id = ? AND recruiter_id = ?',
      [jobId, recruiterId]
    );

    if (jobRows.length === 0) {
      return res.status(404).json({ ok: false, message: "Job not found or access denied" });
    }

    // Get applicants for this job
    const sql = `
  SELECT
    ja.id as application_id,
    ja.status,
    ja.cover_letter,
    ja.resume_path,
    ja.applied_at,
    ja.updated_at,
    u.id as user_id,
    u.email,
    u.name,
    up.full_name,
    up.phone,
    up.city,
    up.state,
    up.country,
    up.experience_years,
    up.highest_qualification,
    up.linkedin_url,
    up.github_url,
    up.trade_stream,
    up.job_type,
    up.expected_salary,
    up.date_of_birth,
    up.gender,
    up.availability,
    up.id_proof_available,
    up.preferred_contact_method,
    up.willing_to_relocate
  FROM job_applications ja
  INNER JOIN users u ON ja.user_id = u.id
  LEFT JOIN candidate_profiles up ON u.id = up.user_id
  WHERE ja.job_id = ?
  ORDER BY ja.applied_at DESC
`;

    const [applicants] = await pool.query(sql, [jobId]);

    const result = applicants.map(app => ({
      applicationId: app.application_id,
      status: app.status,
      coverLetter: app.cover_letter,
      resumePath: app.resume_path,
      appliedAt: app.applied_at,
      updatedAt: app.updated_at,
      user: {
        id: app.user_id,
        email: app.email,
        name: app.name,
        fullName: app.full_name,
        phone: app.phone,
        location: `${app.city || ''}${app.city && app.state ? ', ' : ''}${app.state || ''}`,
        city: app.city,
        state: app.state,
        country: app.country,
        experienceYears: app.experience_years,
        highestEducation: app.highest_qualification,
        linkedinUrl: app.linkedin_url,
        githubUrl: app.github_url,
        tradeStream: app.trade_stream,
        keySkills: app.key_skills,           // ← Changed from skillLevel
        jobType: app.job_type,
        expectedSalary: app.expected_salary,
        dateOfBirth: app.date_of_birth,
        gender: app.gender,
        availability: app.availability,
        idProofAvailable: app.id_proof_available,
        preferredContactMethod: app.preferred_contact_method,
        willingToRelocate: app.willing_to_relocate
      }
    }));

    res.json({ ok: true, applicants: result });
  } catch (err) {
    console.error('GET /api/recruiter/jobs/:jobId/applicants error:', err);
    res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
}

module.exports = getJobApplicants;