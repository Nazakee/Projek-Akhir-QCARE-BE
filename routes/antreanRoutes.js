
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllAntrean,
    getAntreanById,
    createAntrean,
    updateAntrean,
    deleteAntrean
} = require("../controllers/antreanController");

router.get("/", authorizeRole("admin"), getAllAntrean);
router.get("/:id", getAntreanById);
router.post("/", createAntrean);
router.put("/:id", updateAntrean);
router.delete("/:id", authorizeRole("admin"), deleteAntrean);

module.exports = router;
