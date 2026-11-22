
const express = require("express");
const router = express.Router();
const authorizeRole = require("../middleware/roleMiddleware");

const {
    getAllPasien,
    getPasienById,
    createPasien,
    updatePasien,
    deletePasien
} = require("../controllers/pasienController");


router.get("/", authorizeRole("admin"), getAllPasien);
router.get("/:id", getPasienById);

router.post("/", authorizeRole("admin"), createPasien);
router.put("/:id", updatePasien);
router.delete("/:id", authorizeRole("admin"), deletePasien);


module.exports = router;
