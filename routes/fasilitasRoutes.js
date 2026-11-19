
const express = require("express");
const router = express.Router();

const {
    getAllFasilitas,
    getFasilitasById,
    createFasilitas,
    updateFasilitas,
    deleteFasilitas
} = require("../controllers/fasilitasController");

// GET: Semua fasilitas
router.get("/", getAllFasilitas);

// GET: Fasilitas berdasarkan ID
router.get("/:id", getFasilitasById);

// POST: Tambah fasilitas
router.post("/", createFasilitas);

// PUT: Update fasilitas
router.put("/:id", updateFasilitas);

// DELETE: Hapus fasilitas
router.delete("/:id", deleteFasilitas);

module.exports = router;
