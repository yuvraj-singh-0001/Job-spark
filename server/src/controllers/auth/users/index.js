const express = require("express");
const router = express.Router();

/**
 * Auth Handlers
 * --------------
 * Located in: src/api/auth/users/
 */
const signUp = require("../../../api/auth/users/sign-up");
const signIn = require("../../../api/auth/users/sign-in");
const getUsers = require("../../../api/auth/users/get-users");
const getUser = require("../../../api/auth/users/get-user");
const updateUser = require("../../../api/auth/users/update-user");
const deleteUser = require("../../../api/auth/users/delete-user");

/**
 * Auth Middleware
 * ----------------
 * requireAuth → verifies JWT cookie
 * authCheck   → returns decoded user info
 */
const { requireAuth, authCheck } = require("../../../middlewares/auth");

/**
 * Mounted at: /api/auth
 * Final routes become:
 *   POST    /api/auth/signup
 *   POST    /api/auth/login
 *   GET     /api/auth/authcheck
 *   GET     /api/auth/users
 *   GET     /api/auth/users/:id
 *   PUT     /api/auth/users/:id
 *   DELETE  /api/auth/users/:id
 */

// Authentication
router.post("/signup", signUp);
router.post("/login", signIn);

// Token validation route
router.get("/authcheck", requireAuth, authCheck);

// Users CRUD
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
