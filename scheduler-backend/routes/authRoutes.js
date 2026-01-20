const express = require("express");
const router = express.Router();

const authController = require("../controller/authController")

router.post("/admin-login",authController.adminLogin)
// router.post("/candidate-login",authController.candidateLogin)

module.exports =router;