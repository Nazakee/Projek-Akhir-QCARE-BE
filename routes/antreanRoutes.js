
const express = require("express");
const router = express.Router();

const {
    getAllAntrean,
    getAntreanById,
    createAntrean,
    updateAntrean,
    deleteAntrean
} = require("../controllers/antreanController");

router.get("/", getAllAntrean);
router.get("/:id", getAntreanById);
router.post("/", createAntrean);
router.put("/:id", updateAntrean);
router.delete("/:id", deleteAntrean);

module.exports = router;
