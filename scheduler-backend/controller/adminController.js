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


exports.getAllSlots = (req, res) => {

   const sql = `
  SELECT 
    id, 
    DATE_FORMAT(slot_date, '%Y-%m-%d') AS date, 
    TIME_FORMAT(start_time, '%H:%i') AS startTime, 
    TIME_FORMAT(end_time, '%H:%i') AS endTime,
    is_booked AS isBooked
  FROM interview_slots 
  WHERE created_by_admin_id = ? 
  ORDER BY slot_date ASC, start_time ASC
`;

    pool.query(sql, [req.adminId], (error, data) => {
        if (data)
            res.send(data);
        else
            res.send(error);
    })
}

exports.createSlot =(req,res) =>{
      const { slotDate, startTime, endTime } = req.body;


      const checkSql = `
    SELECT id FROM interview_slots
    WHERE slot_date = ? AND start_time = ? AND end_time = ?
  `;

  pool.query(
    checkSql,
    [slotDate, startTime, endTime],
    (checkErr, rows) => {
      if (checkErr) {
        return res.send("Database error" );
      }

      if (rows.length > 0) {
        return res.send("Slot already exists")
      }
     
      const insertSql = `
        INSERT INTO interview_slots
        (slot_date, start_time, end_time, created_by_admin_id)
        VALUES (?, ?, ?, ?)
      `;

      pool.query(
        insertSql,
        [slotDate, startTime, endTime, req.adminId],
        (err, result) => {
          if (err) {
            return res.send(err)
          }

          return res.send(result)
        }
      );
    }
  );
}

exports.deleteSlot = (req, res) =>{
  const { id } = req.params;

  const deleteSql =
      "DELETE FROM interview_slots WHERE id = ?";

    pool.query(deleteSql, [id], (err) => {
      if (err) {
        return res.send(err);
      }

      return res.send("Slot deleted successfully")
      
    });
}