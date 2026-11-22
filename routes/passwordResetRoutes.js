
const express = require("express");
const router = express.Router();

const {
    requestPasswordReset,
    verifyPasswordResetOTP,
    resetPassword
} = require("../controllers/passwordResetController");

router.post("/request", requestPasswordReset);
router.post("/verify", verifyPasswordResetOTP);
router.post("/reset", resetPassword);

module.exports = router;
