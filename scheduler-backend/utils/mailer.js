const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: process.env.EMAIL_PORT,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendBookingEmailToAdmin = async ({
  candidateEmail,
  slotDate,
  startTime,
  endTime,
}) => {
  const mailOptions = {
    from: `"Interview Scheduler" <${process.env.EMAIL_USER}>`,
    to: process.env.ADMIN_EMAIL,
    subject: "New Interview Slot Booked",
    html: `
      <h3>New Interview Booking</h3>
      <p><strong>Candidate:</strong> ${candidateEmail}</p>
      <p><strong>Date:</strong> ${slotDate}</p>
      <p><strong>Time:</strong> ${startTime} - ${endTime}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};
