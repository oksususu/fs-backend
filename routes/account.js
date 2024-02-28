const express = require("express");
const { asyncHandler } = require("../utils/async-handler");
const accountController = require("../controllers/account");
const passport = require("passport");

const router = express.Router();

router.get("/", passport.authenticate("jwt-user", { session: false }), asyncHandler(accountController.getUserInfo));
router.post("/", asyncHandler(accountController.signUp));
router.put("/", passport.authenticate("jwt-user", { session: false }), asyncHandler(accountController.updateUser));
router.delete("/", passport.authenticate("jwt-user", { session: false }), asyncHandler(accountController.deleteUser));

router.post("/login", passport.authenticate("local-user", { session: false }), asyncHandler(accountController.signIn));

module.exports = router;
