
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllLayanan,
    getLayananById,
    createLayanan,
    updateLayanan,
    deleteLayanan
} = require("../controllers/layananController");

router.get("/", getAllLayanan);

router.get("/:id", getLayananById);

router.post("/", authorizeRole("admin"), createLayanan);

router.put("/:id", authorizeRole("admin"), updateLayanan);

router.delete("/:id", authorizeRole("admin"), deleteLayanan);

module.exports = router;
