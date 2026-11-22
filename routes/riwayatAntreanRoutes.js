const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllRiwayatAntrean,
    getRiwayatAntreanById,
    createRiwayatAntrean,
    updateRiwayatAntrean,
    deleteRiwayatAntrean
} = require("../controllers/riwayatAntreanController");

router.get("/", authorizeRole("admin"), getAllRiwayatAntrean);
router.get("/:id", getRiwayatAntreanById);

router.post("/", authorizeRole("admin"), createRiwayatAntrean);
router.put("/:id", authorizeRole("admin"), updateRiwayatAntrean);
router.delete("/:id", authorizeRole("admin"), deleteRiwayatAntrean);

module.exports = router;
