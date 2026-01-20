const pool = require("../config/db");

exports.addWhitelistEmail = (req, res) => {
    const { email } = req.body;

    const sql = `INSERT INTO whitelisted_email (email, added_by_admin_id) VALUES (?, ?)`

    pool.query(sql, [email, req.adminId], (error, data) => {
        if (error)
            res.send(error)

        if (!data || data.length === 0) {
            return res.send(error);
        }

        res.send(data);
    });
};

exports.getWhitelistedEmails = (req, res) => {
    const sql = `SELECT * FROM whitelisted_email WHERE added_by_admin_id = ?`;

    pool.query(sql, [req.adminId], (error, data) => {
        if (data)
            res.send(data);
        else
            res.send(error);
    });
};

exports.deleteWhitelistedEmail = (req, res) => {
    const { id } = req.params;


    const sql = `DELETE FROM whitelisted_email WHERE id = ?`;

    pool.query(sql, [id], (error) => {
        if (error)
            return res.send(error);


    });

};
