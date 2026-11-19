
const express = require("express");
const router = express.Router();

const {
    getAllDokter,
    getDokterById,
    createDokter,
    updateDokter,
    deleteDokter
} = require("../controllers/dokterController");

router.get("/", getAllDokter);
router.get("/:id", getDokterById);
router.post("/", createDokter);
router.put("/:id", updateDokter);
router.delete("/:id", deleteDokter);

module.exports = router;
