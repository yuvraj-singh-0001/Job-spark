// routes/jobs.js - expose job APIs at the router root
const express = require("express");
const jobsRouter = require("../../api/jobs/get-jobs"); // path to file above
const router = express.Router();

// Mount the API router at the root so that when this controller
// is mounted at '/jobs' from the main router, the paths align:
//   main router: router.use('/jobs', thisRouter)
//   api route:   GET / -> handled by get-jobs.js
router.use("/", jobsRouter);

module.exports = router;
