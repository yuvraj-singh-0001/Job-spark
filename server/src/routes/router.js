const express = require('express');
const router = express.Router();
const index = require('../controllers/auth/users/index');
router.use('/auth', index);


module.exports = router;