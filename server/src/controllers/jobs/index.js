const express = require("express");
const router = express.Router();

// Import job controllers
const getjobs = require("../../api/jobs/get-jobs");
const getjobdetails = require("../../api/jobs/get-jobdetails");
const { postApplication, upload } = require("../../api/jobs/applications");
const getAppliedJobs = require("../../api/jobs/getapplied");
const removeSavedJob = require("../../api/jobs/savejobs/removeSavedJob");
const checkSavedJob = require("../../api/jobs/savejobs/checkSavedJob");
const saveJob = require("../../api/jobs/savejobs/savedJobs");
const getSavedJobs = require("../../api/jobs/savejobs/getSavedJobs");
const { requireAuth } = require("../../middlewares/auth");

// Debug routes for testing
router.get("/debug/test", (req, res) => {
  res.json({ 
    success: true, 
    message: "Jobs API is working!",
    timestamp: new Date().toISOString()
  });
});

router.get("/debug/auth-test", requireAuth, (req, res) => {
  res.json({ 
    success: true, 
    message: "Auth is working!",
    user: req.user,
    timestamp: new Date().toISOString()
  });
});

router.get("/debug/saved-test", requireAuth, async (req, res) => {
  try {
    const pool = require('../../config/db');
    const [rows] = await pool.execute('SELECT COUNT(*) as count FROM saved_jobs WHERE user_id = ?', [req.user.id]);
    
    res.json({ 
      success: true, 
      message: "Saved jobs test",
      user_id: req.user.id,
      saved_count: rows[0].count,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: "Saved jobs test failed",
      error: error.message 
    });
  }
});

// Apply auth middleware to protected routes
router.get("/applied-jobs", requireAuth, getAppliedJobs);
router.post("/apply", requireAuth, upload.single("resume"), postApplication);

// Saved jobs routes
router.post("/save/:job_id", requireAuth, saveJob);
router.delete("/save/:job_id", requireAuth, removeSavedJob);
router.get("/save/:job_id", requireAuth, checkSavedJob);
router.get("/saved-jobs", requireAuth, getSavedJobs);

// Public routes
router.get("/", getjobs);
router.get("/:id", getjobdetails);

module.exports = router;