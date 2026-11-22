
const express = require("express");
const router = express.Router();

const {
    registerPasien,
    loginPasien
} = require("../controllers/pasienAuthController");

router.post("/register", registerPasien);
router.post("/login", loginPasien);

module.exports = router;
