const pool = require("../config/db");


// --- Get all slots
exports.getAvailableSlots = (req, res) => {
  const sql = `
    SELECT
      id,
      slot_date,
      start_time,
      end_time
    FROM interview_slots
    WHERE is_booked = false
      AND slot_date >= CURDATE()
    ORDER BY slot_date ASC, start_time ASC
  `;

  pool.query(sql, (error, data) => {
    if (error) {
      console.error("Error fetching available slots:", error);
      return res.send(error)
    }

    return res.send(data)
  });
}

// Slot Booking
exports.bookSlot = (req, res) => {
  const { slotId } = req.body;
  const whitelistedEmailId = req.whitelistedEmailId;

  if (!slotId) {
    return res.status(400).json({
      message: "Slot ID is required",
    });
  }

 
  const checkCandidateSql = `
    SELECT id FROM interview_bookings
    WHERE whitelisted_email_id = ?
  `;

  pool.query(checkCandidateSql, [whitelistedEmailId], (err, rows) => {
    if (err) {
      return res.send(err)
    }

    if (rows.length > 0) {
      return res.send("You have already booked a slot")
    }

  
    const checkSlotSql = `
      SELECT is_booked FROM interview_slots
      WHERE id = ?
    `;

    pool.query(checkSlotSql, [slotId], (err, rows) => {
      if (err) {
        return res.send(err)
      }

      if (rows.length === 0) {
        return res.send("Slot not found")
      }

      if (rows[0].is_booked) {
        return res.send("Slot already booked")
      }

    
      const insertBookingSql = `
        INSERT INTO interview_bookings (slot_id, whitelisted_email_id)
        VALUES (?, ?)
      `;

      pool.query(
        insertBookingSql,
        [slotId, whitelistedEmailId],
        (err) => {
          if (err) {
            return res.send("Failed to book slot")
          }

      
          const updateSlotSql = `
            UPDATE interview_slots
            SET is_booked = true
            WHERE id = ?
          `;

          pool.query(updateSlotSql, [slotId], (err) => {
            if (err) {
              return res.send("Failed to update slot")
            }

            return res.send("Slot booked successfully")
          });
        }
      );
    });
  });
};




