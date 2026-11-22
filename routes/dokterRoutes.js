
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllDokter,
    getDokterById,
    createDokter,
    updateDokter,
    deleteDokter
} = require("../controllers/dokterController");

router.get("/", getAllDokter);
router.get("/:id", getDokterById);
router.post("/", authorizeRole("admin"), createDokter);
router.put("/:id", authorizeRole("admin"), updateDokter);
router.delete("/:id", authorizeRole("admin"), deleteDokter);

module.exports = router;
