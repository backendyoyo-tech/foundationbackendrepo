const express = require("express");
const router = express.Router();
const authController = require("../controllers/auth.controller");

const otpController = require("../controllers/otp.controller");

router.post("/signup", authController.signup);
router.post("/login", authController.login);

router.post("/send-otp", otpController.sendOtp);
router.post("/verify-otp", otpController.verifyOtp);

module.exports = router;