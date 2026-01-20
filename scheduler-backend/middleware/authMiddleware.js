require("dotenv").config();
const jwt = require("jsonwebtoken");

function authMiddleware(req, res, next) {
  try {
    
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.send(
        "Authorization header missing"
      );
    }
    
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.send("Token missing");
    }

    const payload = jwt.verify(token, process.env.JWT_SECRET);

    req.adminId = payload.adminId;
    next();
  } catch (err) {
    res.send("Invalid or expired token");
  }
}

module.exports = authMiddleware;
