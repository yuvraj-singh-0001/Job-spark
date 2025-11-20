// api/jobs/get-jobs.js
const express = require("express");
const pool = require("../config/db"); // adjust path if needed
const router = express.Router();

// Helper to turn comma-separated skills into array
function parseSkills(skills) {
  if (!skills) return [];
  return skills
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

// GET /api/jobs
// optional query params: limit (number), recentOnly (boolean)
router.get("/", async (req, res) => {
  try {
    const limit = Math.max(1, Math.min(100, parseInt(req.query.limit || "10", 10)));
    const sql = `
      SELECT
        id,
        title,
        company,
        job_type,
        city,
        locality,
        skills,
        min_experience,
        max_experience,
        salary,
        vacancies,
        description,
        logo_path,
        created_at
      FROM recruiter_jobs
      ORDER BY created_at DESC
      LIMIT ?
    `;
    const [rows] = await pool.query(sql, [limit]);

    const jobs = rows.map((r) => {
      // build experience string similar to your frontend display
      let experiance = "Not specified";
      if (r.min_experience == null && r.max_experience == null) experiance = "Fresher";
      else if (r.min_experience != null && r.max_experience == null)
        experiance = `${r.min_experience}+ yrs`;
      else if (r.min_experience == null && r.max_experience != null)
        experiance = `Up to ${r.max_experience} yrs`;
      else experiance = `${r.min_experience}-${r.max_experience} yrs`;

      return {
        id: r.id,
        title: r.title,
        company: r.company,
        type: r.job_type || "Full-time",
        location: r.city + (r.locality ? `, ${r.locality}` : ""),
        tags: parseSkills(r.skills),
        salary: r.salary || null,
        vacancies: r.vacancies,
        description: r.description,
        logoPath: r.logo_path || null,
        createdAt: r.created_at, // ISO string or Date
        experiance,
      };
    });

    return res.json({ ok: true, jobs });
  } catch (err) {
    console.error("GET /api/jobs error:", err);
    return res.status(500).json({ ok: false, message: "Internal Server Error" });
  }
});

// GET /api/jobs/:id -> single job
router.get("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id, 10);
    if (Number.isNaN(id)) return res.status(400).json({ ok: false, message: 'Invalid job id' });

    const sql = `
      SELECT
        id,
        title,
        company,
        job_type,
        city,
        locality,
        skills,
        min_experience,
        max_experience,
        salary,
        vacancies,
        description,
        logo_path,
        created_at
      FROM recruiter_jobs
      WHERE id = ?
      LIMIT 1
    `;

    const [rows] = await pool.query(sql, [id]);
    if (!rows || rows.length === 0) return res.status(404).json({ ok: false, message: 'Job not found' });

    const r = rows[0];
    let experiance = 'Not specified';
    if (r.min_experience == null && r.max_experience == null) experiance = 'Fresher';
    else if (r.min_experience != null && r.max_experience == null) experiance = `${r.min_experience}+ yrs`;
    else if (r.min_experience == null && r.max_experience != null) experiance = `Up to ${r.max_experience} yrs`;
    else experiance = `${r.min_experience}-${r.max_experience} yrs`;

    const job = {
      id: r.id,
      title: r.title,
      company: r.company,
      type: r.job_type || 'Full-time',
      location: r.city + (r.locality ? `, ${r.locality}` : ''),
      tags: (r.skills || '').split(',').map(s => s.trim()).filter(Boolean),
      salary: r.salary || null,
      vacancies: r.vacancies,
      description: r.description,
      logoPath: r.logo_path || null,
      createdAt: r.created_at,
      experiance,
      min_experience: r.min_experience,
      max_experience: r.max_experience,
      contactEmail: r.contact_email || null,
      contactPhone: r.contact_phone || null,
      interviewAddress: r.interview_address || null,
    };

    return res.json({ ok: true, job });
  } catch (err) {
    console.error('GET /api/jobs/:id error:', err);
    return res.status(500).json({ ok: false, message: 'Internal Server Error' });
  }
});

module.exports = router;
