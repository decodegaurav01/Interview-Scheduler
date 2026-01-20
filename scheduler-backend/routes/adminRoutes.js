const express = require("express");
const router = express.Router();

const adminController = require("../controller/adminController")
const authMiddleware = require("../middleware/authMiddleware")
 
router.post("/add-whitelist",authMiddleware,adminController.addWhitelistEmail)
router.get("/whitelisted-email",authMiddleware,adminController.getWhitelistedEmails)
router.delete("/delete-whitelisted-email/:id",authMiddleware,adminController.deleteWhitelistedEmail)


module.exports =router;