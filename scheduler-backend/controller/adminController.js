const pool = require("../config/db");


//---- Dashboard ---------
exports.getAllInterviewBookings = (req, res) => {
  const sql = `
    SELECT
      ib.id AS id,
      we.email AS candidate_email,
      DATE_FORMAT(islots.slot_date, '%Y-%m-%d') AS date, 
    TIME_FORMAT(islots.start_time,'%H:%i') AS startTime, 
    TIME_FORMAT(islots.end_time, '%H:%i') AS endTime,
      ib.booked_at
    FROM interview_bookings ib
    JOIN whitelisted_email we
      ON ib.whitelisted_email_id = we.id
    JOIN interview_slots islots
      ON ib.slot_id = islots.id
    ORDER BY ib.booked_at DESC
  `;

  pool.query(sql, (error, data) => {
    if (error) {
      console.error("Error fetching interview bookings:", error);
      return res.send(error);
    }

    return res.send(data)
  });
};

exports.cancelBooking = (req, res) => {
  const { bookingId } = req.params;

  if (!bookingId) {
    return res.status(400).json({
      message: "Booking ID is required",
    });
  }


  const bookingSql = `
    SELECT slot_id
    FROM interview_bookings
    WHERE id = ?
  `;

  pool.query(bookingSql, [bookingId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    if (rows.length === 0) {
      return res.status(404).json({
        message: "Booking not found",
      });
    }

    const slotId = rows[0].slot_id;

    const deleteBookingSql = `
      DELETE FROM interview_bookings
      WHERE id = ?
    `;

    pool.query(deleteBookingSql, [bookingId], (err) => {
      if (err) {
        return res.status(500).json({
          message: "Failed to cancel booking",
        });
      }

      const updateSlotSql = `
        UPDATE interview_slots
        SET is_booked = false
        WHERE id = ?
      `;

      pool.query(updateSlotSql, [slotId], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update slot status",
          });
        }

        return res.status(200).json({
          message: "Booking cancelled and slot is now available",
        });
      });
    });
  });
};


//---- Whitelisted Email-------

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

  
  const bookingSql = `
    SELECT slot_id
    FROM interview_bookings
    WHERE whitelisted_email_id = ?
  `;

  pool.query(bookingSql, [id], (err, bookings) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    const hasBooking = bookings.length > 0;
    const slotId = hasBooking ? bookings[0].slot_id : null;

    const freeSlot = (callback) => {
      if (!hasBooking) return callback();

      const updateSlotSql = `
        UPDATE interview_slots
        SET is_booked = false
        WHERE id = ?
      `;

      pool.query(updateSlotSql, [slotId], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to update slot status",
          });
        }
        callback();
      });
    };

   
    freeSlot(() => {
      const deleteEmailSql = `
        DELETE FROM whitelisted_email
        WHERE id = ?
      `;

      pool.query(deleteEmailSql, [id], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to delete whitelisted email",
          });
        }

        return res.status(200).json({
          message:
            "Whitelisted email deleted and slot availability updated",
        });
      });
    });
  });
};

//----- Slot ------
exports.getAllSlots = (req, res) => {

  const sql = `
  SELECT 
    id, 
    DATE_FORMAT(slot_date, '%Y-%m-%d') AS date, 
    TIME_FORMAT(start_time, '%H:%i') AS startTime, 
    TIME_FORMAT(end_time, '%H:%i') AS endTime,
    is_booked AS isBooked,
    is_active AS isActive
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

exports.createSlot = (req, res) => {
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
        return res.send("Database error");
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

exports.deleteSlot = (req, res) => {
  const { id } = req.params;

  const bookingSql = `
    SELECT id
    FROM interview_bookings
    WHERE slot_id = ?
  `;

  pool.query(bookingSql, [id], (err, bookings) => {
    if (err) {
      return res.status(500).json({
        message: "Database error",
      });
    }

    const hasBooking = bookings.length > 0;

    const deleteBooking = (callback) => {
      if (!hasBooking) return callback();

      const sql = `
        DELETE FROM interview_bookings
        WHERE slot_id = ?
      `;

      pool.query(sql, [id], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to delete booking",
          });
        }
        callback();
      });
    };

    deleteBooking(() => {
      const deleteSlotSql = `
        DELETE FROM interview_slots
        WHERE id = ?
      `;

      pool.query(deleteSlotSql, [id], (err) => {
        if (err) {
          return res.status(500).json({
            message: "Failed to delete slot",
          });
        }

        return res.status(200).json({
          message: "Slot deleted successfully",
        });
      });
    });
  });
};


exports.updateSlotStatus = (req, res) => {
  const { id } = req.params;
  const { isActive } = req.body;

  if (typeof isActive !== "boolean") {
    return res.status(400).json({
      message: "isActive must be boolean",
    });
  }

  const sql = `
    UPDATE interview_slots
    SET is_active = ?
    WHERE id = ?
  `;

  pool.query(sql, [isActive, id], (err, result) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to update slot status",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        message: "Slot not found",
      });
    }

    return res.status(200).json({
      message: `Slot ${isActive ? "activated" : "frozen"} successfully`,
    });
  });
};
