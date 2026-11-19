
const express = require("express");
const router = express.Router();

const {
    getAllRiwayatAntrean,
    getRiwayatAntreanById,
    createRiwayatAntrean,
    updateRiwayatAntrean,
    deleteRiwayatAntrean
} = require("../controllers/riwayatAntreanController");

router.get("/", getAllRiwayatAntrean);
router.get("/:id", getRiwayatAntreanById);
router.post("/", createRiwayatAntrean);
router.put("/:id", updateRiwayatAntrean);
router.delete("/:id", deleteRiwayatAntrean);

module.exports = router;
