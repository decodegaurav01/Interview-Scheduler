const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController")
const authMiddleware = require("../middleware/authMiddleware")


// ------Whitelist Email Routes-------// 
router.get("/whitelisted-email",authMiddleware,adminController.getWhitelistedEmails)
router.post("/add-whitelist",authMiddleware,adminController.addWhitelistEmail)
router.delete("/delete-whitelisted-email/:id",authMiddleware,adminController.deleteWhitelistedEmail)

//-------Slot Routes------------//

router.get("/available-slots",authMiddleware,adminController.getAllSlots)
router.post("/create-slot",authMiddleware,adminController.createSlot)
router.delete("/delete-slot/:id",authMiddleware,adminController.deleteSlot)




module.exports =router;