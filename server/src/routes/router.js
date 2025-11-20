const express = require('express');
const router = express.Router();

/**
 * Import the main Auth index router
 * ---------------------------------
 * This file (../controllers/auth/users/index) typically exports
 * a nested router that contains all authentication-related routes:
 *
 *  - /signup
 *  - /login
 *  - /logout
 *  - /me or /authcheck
 *  - etc.
 *
 * By mounting it under /auth here, the final path becomes:
 *    /api/auth/...
 */
const index = require('../controllers/auth/users/index');

// Mount all auth-related routes under /auth
router.use('/auth', index);

// Export top-level API router
module.exports = router;
