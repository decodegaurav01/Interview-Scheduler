const express = require("express");
const router = express.Router();

const candidateController = require("../controller/candidateController")
const authMiddleware = require("../middleware/authMiddleware")


router.get("/available-slots",authMiddleware,candidateController.getAvailableSlots);
router.post("/slot-booking",authMiddleware,candidateController.bookSlot);

module.exports = router;