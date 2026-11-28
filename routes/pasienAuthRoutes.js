const express = require("express");
const router = express.Router();

const {
    registerPasien,
    loginPasien,
    googleLogin
} = require("../controllers/pasienAuthController");

router.post("/register", registerPasien);
router.post("/login", loginPasien);
router.post("/google", googleLogin);

module.exports = router;