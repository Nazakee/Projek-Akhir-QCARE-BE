
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllFasilitas,
    getFasilitasById,
    createFasilitas,
    updateFasilitas,
    deleteFasilitas
} = require("../controllers/fasilitasController");


router.get("/", getAllFasilitas);
router.get("/:id", getFasilitasById);

router.post("/", authorizeRole("admin"), createFasilitas);
router.put("/:id", authorizeRole("admin"), updateFasilitas);
router.delete("/:id", authorizeRole("admin"), deleteFasilitas);

module.exports = router;
