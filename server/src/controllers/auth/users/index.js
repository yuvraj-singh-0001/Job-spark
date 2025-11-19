const express = require("express");
const router = express.Router();

// Use handlers defined in src/api/auth/users
const signUp = require("../../../api/auth/users/sign-up");
const signIn = require("../../../api/auth/users/sign-in");
const getUsers = require("../../../api/auth/users/get-users");
const getUser = require("../../../api/auth/users/get-user");
const updateUser = require("../../../api/auth/users/update-user");
const deleteUser = require("../../../api/auth/users/delete-user");

// Mounted at /api/auth by routes/router.js, so expose relative paths only
router.post("/signup", signUp);
router.post("/login", signIn);
// Users CRUD
router.get("/users", getUsers);
router.get("/users/:id", getUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

module.exports = router;
