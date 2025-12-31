const express = require("express");
const router = express.Router();

//  here are Import job controllers
const getjobs = require("../../api/jobs/get-jobs");
const getjobdetails = require("../../api/jobs/get-jobdetails");
const getFilters = require("../../api/jobs/get-filters");
const getCategoryCounts = require("../../api/jobs/get-category-counts");
const getRoles = require("../../api/jobs/get-roles");
const { postApplication, upload } = require("../../api/jobs/applications");
const getAppliedJobs = require("../../api/jobs/getapplied");
const removeSavedJob = require("../../api/jobs/savejobs/removeSavedJob");
const checkSavedJob = require("../../api/jobs/savejobs/checkSavedJob");
const saveJob = require("../../api/jobs/savejobs/savedJobs");
const getSavedJobs = require("../../api/jobs/savejobs/getSavedJobs");
const sitemap = require("../../api/jobs/sitemap");
const indeedFeed = require("../../api/jobs/indeed-feed");
const { checkJobExpiration, extendJobExpiration, getExpiringJobs } = require("../../api/jobs/job-expiration");
const { requireAuth } = require("../../middlewares/auth");
const { validateJobFilters } = require("../../middlewares/inputValidation");

// Apply auth middleware to protected routes
router.get("/applied-jobs", requireAuth, getAppliedJobs);
router.post("/apply", requireAuth, upload.single("resume"), postApplication);

// Job expiration routes
router.get("/:id/expiration", requireAuth, checkJobExpiration);
router.post("/:id/extend-expiration", requireAuth, extendJobExpiration);
router.get("/recruiter/expiring", requireAuth, getExpiringJobs);

// Saved jobs routes
router.post("/save/:job_id", requireAuth, saveJob);
router.delete("/save/:job_id", requireAuth, removeSavedJob);
router.get("/save/:job_id", requireAuth, checkSavedJob);
router.get("/saved-jobs", requireAuth, getSavedJobs);

// Public routes - SPECIFIC routes first, then parameterized
router.get("/", validateJobFilters, getjobs);
router.get("/filters", getFilters);
router.get("/roles", getRoles);
router.get("/category-counts", validateJobFilters, getCategoryCounts);

// SEO routes - before parameterized routes
router.get("/sitemap.xml", sitemap);
router.get("/indeed-feed.xml", indeedFeed);

// Parameterized routes - last
router.get("/:id", getjobdetails);

module.exports = router;