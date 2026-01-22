require("dotenv").config();
const pool = require("../config/db")
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");


// Admin Login
exports.adminLogin = (req, res) => {
    const { email, password } = req.body;

    const sql = `SELECT * FROM admin WHERE email = ? AND is_active = true`;

    pool.query(sql, [email], async (error, data) => {
        if (error)
            return res.send(error);

        if (!data || data.length === 0) {
            return res.send(error);
        }

        const admin = data[0];
        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.send(error);
        }

        const token = jwt.sign(
            {
                adminId: admin.id,
                role:"ADMIN"
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const body = {
            token,
            name: admin.full_name,
            email: admin.email,
            role:"ADMIN"
        };

        res.send(body);
    });
};


// Candidate Login

exports.candidateLogin = (req, res) => {
  const { email } = req.body;

  
  const sql = `
    SELECT id, email
    FROM whitelisted_email
    WHERE email = ?
  `;

  pool.query(sql, [email], (error, rows) => {
    if (error) {
      return res.send(error)
    }

    if (rows.length === 0) {
      return res.status(403).json({
        message: "Email not authorized",
      });
    }

    const whitelistedEmail = rows[0];

   
    const token = jwt.sign(
      {
        whitelistedEmailId: whitelistedEmail.id,
        email: whitelistedEmail.email,
        role: "CANDIDATE",
        
      },
      process.env.JWT_SECRET,
      { expiresIn: "1d" }
    );

    const body = {
            token,
            email:whitelistedEmail.email,
            role: "CANDIDATE",
        };

    return res.send(body)
  });
};
