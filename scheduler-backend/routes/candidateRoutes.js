const express = require("express");
const router = express.Router();

const candidateController = require("../controller/candidateController")
const authMiddleware = require("../middleware/authMiddleware")


router.post("/slot-booking",authMiddleware,candidateController.bookSlot);
router.get("/dashboard",authMiddleware,candidateController.getCandidateDashboard);

module.exports = router;