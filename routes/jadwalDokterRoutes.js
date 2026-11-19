
const express = require("express");
const router = express.Router();

const {
    getAllJadwalDokter,
    getJadwalDokterById,
    createJadwalDokter,
    updateJadwalDokter,
    deleteJadwalDokter
} = require("../controllers/jadwalDokterController");

router.get("/", getAllJadwalDokter);
router.get("/:id", getJadwalDokterById);
router.post("/", createJadwalDokter);
router.put("/:id", updateJadwalDokter);
router.delete("/:id", deleteJadwalDokter);

module.exports = router;
