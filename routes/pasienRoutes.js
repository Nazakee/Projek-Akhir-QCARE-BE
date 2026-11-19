
const express = require("express");
const router = express.Router();

const {
    getAllPasien,
    getPasienById,
    createPasien,
    updatePasien,
    deletePasien
} = require("../controllers/pasienController");

router.get("/", getAllPasien);
router.get("/:id", getPasienById);
router.post("/", createPasien);
router.put("/:id", updatePasien);
router.delete("/:id", deletePasien);

module.exports = router;
