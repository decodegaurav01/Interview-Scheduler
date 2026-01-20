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
                adminId: admin.id
            },
            process.env.JWT_SECRET,
            { expiresIn: "1h" }
        );

        const body = {
            token,
            name: admin.full_name,
            email: admin.email,
        };

        res.send(body);
    });
};