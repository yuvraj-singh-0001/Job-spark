const express = require('express');
const router = express.Router();
const { requireAuth } = require('../../../middlewares/auth');

// Import job creation handler
const createJob = require('../../../api/recruiter/hire-jobs/create-job');
router.use(requireAuth);
// POST /api/recruiter/jobs/create
router.post('/create', createJob);

module.exports = router;
