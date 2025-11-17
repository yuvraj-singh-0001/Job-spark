const express = require('express');
const router = express.Router();

// Use handlers defined in src/api/auth/users
const signUp = require('../../../api/auth/users/sign-up');
const signIn = require('../../../api/auth/users/sign-in');

// Mounted at /api/auth by routes/router.js, so expose relative paths only
router.post('/signup', signUp);
router.post('/login', signIn);

module.exports = router;