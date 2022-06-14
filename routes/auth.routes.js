const { signup, signin } = require("../controllers/auth.controller");
const express = require("express");
const router = express.Router();
const { validateSignupRequest } = require("../middlewares/verifySignUp");

router.route("/signup").post([validateSignupRequest], signup);
router.route("/signin").post(signin);

module.exports = router;
