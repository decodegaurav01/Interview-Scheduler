const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController")
const authMiddleware = require("../middleware/authMiddleware")


//-----Admin dashboard Routes--------//
router.get("/interview-bookings",authMiddleware,adminController.getAllInterviewBookings)
router.delete("/bookings/:bookingId",authMiddleware,adminController.cancelBooking);


// ------Whitelist Email Routes-------// 
router.get("/whitelisted-email",authMiddleware,adminController.getWhitelistedEmails)
router.post("/add-whitelist",authMiddleware,adminController.addWhitelistEmail)
router.delete("/delete-whitelisted-email/:id",authMiddleware,adminController.deleteWhitelistedEmail)

//-------Slot Routes------------//

router.get("/available-slots",authMiddleware,adminController.getAllSlots)
router.post("/create-slot",authMiddleware,adminController.createSlot)
router.delete("/delete-slot/:id",authMiddleware,adminController.deleteSlot)
router.patch("/slots/:id/status",authMiddleware,adminController.updateSlotStatus);





module.exports =router;