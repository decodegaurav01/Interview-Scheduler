const pool = require("../config/db");
const { sendBookingEmailToAdmin, sendBookingEmailToCandidate } = require("../utils/mailer");



// Slot Booking
exports.bookSlot = (req, res) => {
  const { slotId } = req.body;
  const whitelistedEmailId = req.whitelistedEmailId;
  const candidateEmail = req.candidateEmail;

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
      SELECT slot_date, start_time, end_time, is_booked FROM interview_slots
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

      const slot = rows[0];

      const insertBookingSql = `
        INSERT INTO interview_bookings (slot_id, whitelisted_email_id)
        VALUES (?, ?)
      `;

      pool.query(
        insertBookingSql,
        [slotId, whitelistedEmailId],
        (err) => {
          if (err) {
            return res.send(err)
          }

          const updateSlotSql = `
            UPDATE interview_slots
            SET is_booked = true
            WHERE id = ?
          `;

          pool.query(updateSlotSql, [slotId],  (err) => {
            if (err) {
              return res.send("Failed to update slot")
            }

            try {
               sendBookingEmailToAdmin({
                candidateEmail,
                slotDate: slot.slot_date,
                startTime: slot.start_time,
                endTime: slot.end_time,
              });


               sendBookingEmailToCandidate({
                candidateEmail,
                slotDate: slot.slot_date,
                startTime: slot.start_time,
                endTime: slot.end_time,
              });
            } catch (emailErr) {
              console.error("Email failed:", emailErr);
            }

            return res.send("Slot booked successfully")
          });
        }
      );
    });
  });
};

// candidate Dasboard

exports.getCandidateDashboard = (req, res) => {
  const whitelistedEmailId = req.whitelistedEmailId;

  const bookingSql = `
    SELECT
      ib.id AS booking_id,
      islots.slot_date,
      islots.start_time,
      islots.end_time,
      ib.booked_at
    FROM interview_bookings ib
    JOIN interview_slots islots
      ON ib.slot_id = islots.id
    WHERE ib.whitelisted_email_id = ?
  `;

  pool.query(bookingSql, [whitelistedEmailId], (err, rows) => {
    if (err) {
      return res.send(err)
    }

    if (rows.length > 0) {
      return res.status(200).json({
        hasBooked: true,
        booking: rows[0],
      });
    }

  
    const slotsSql = `
      SELECT
        id,
        slot_date,
        start_time,
        end_time
      FROM interview_slots
      WHERE is_booked = false
        AND is_active = True
        AND slot_date >= CURDATE()
      ORDER BY slot_date ASC, start_time ASC
    `;

    pool.query(slotsSql, (err, slots) => {
      if (err) {
        return res.send(err)
      }

      return res.status(200).json({
        hasBooked: false,
        availableSlots: slots,
      });
    });
  });
};

exports.getCandidateInterviewDetails = (req, res) => {
  const whitelistedEmailId = req.whitelistedEmailId;

  if (!whitelistedEmailId) {
    return res.status(401).json({
      message: "Unauthorized candidate",
    });
  }

  const sql = `
    SELECT
      s.slot_date,
      s.start_time,
      s.end_time,
      ib.meeting_link,
      ib.interviewer_name,
      ib.interviewer_email,
      ib.interviewer_role,
      ib.admin_note
    FROM interview_bookings ib
    JOIN interview_slots s ON ib.slot_id = s.id
    WHERE ib.whitelisted_email_id = ?
    LIMIT 1
  `;

  pool.query(sql, [whitelistedEmailId], (err, rows) => {
    if (err) {
      return res.status(500).json({
        message: "Failed to fetch interview details",
      });
    }

    if (rows.length === 0) {
      return res.status(200).json({
        hasInterview: false,
      });
    }

    return res.status(200).json({
      hasInterview: true,
      interview: rows[0],
    });
  });
};




