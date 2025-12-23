const express = require('express');
const router = express.Router();
const user = require("../../../api/profile/candidate/candidate-put");
const getuser = require("../../../api/profile/candidate/candidate-get");
const uploadResume = require("../../../api/profile/candidate/upload-resume");
const { requireAuth } = require('../../../middlewares/auth');

// Ensure JSON payloads are parsed for profile routes
router.use(express.json());
router.get('/user', requireAuth, getuser);
router.put('/user', requireAuth, user);
router.post('/upload-resume', requireAuth, ...uploadResume);
module.exports = router;