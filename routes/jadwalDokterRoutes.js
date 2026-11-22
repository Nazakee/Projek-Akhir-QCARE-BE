
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllJadwalDokter,
    getJadwalDokterById,
    createJadwalDokter,
    updateJadwalDokter,
    deleteJadwalDokter
} = require("../controllers/jadwalDokterController");

router.get("/", getAllJadwalDokter);
router.get("/:id", getJadwalDokterById);
router.post("/", authorizeRole("admin"), createJadwalDokter);
router.put("/:id", authorizeRole("admin"), updateJadwalDokter);
router.delete("/:id", authorizeRole("admin"), deleteJadwalDokter);

module.exports = router;
