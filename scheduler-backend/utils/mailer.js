const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT),
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.transporter = transporter;


transporter.verify((err, success) => {
  if (err) {
    console.error("❌ Email transporter error:", err.message);
  } else {
    console.log("✅ Email service ready",success);
  }
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
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; background-color: #f3f4f6; }
        .container { max-width: 600px; margin: 20px auto; background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
        .header { background: linear-gradient(135deg, #4f46e5 0%, #4338ca 100%); padding: 30px 20px; text-align: center; }
        .header h1 { color: #ffffff; margin: 0; font-size: 22px; font-weight: 600; letter-spacing: 0.5px; }
        .content { padding: 40px 30px; }
        .info-card { background-color: #f9fafb; border-radius: 8px; padding: 20px; border: 1px solid #e5e7eb; margin-top: 20px; }
        .info-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e5e7eb; }
        .info-row:last-child { border-bottom: none; }
        .label { color: #6b7280; font-size: 14px; font-weight: 500; }
        .value { color: #111827; font-size: 15px; font-weight: 600; text-align: right; }
        .footer { background-color: #f9fafb; padding: 20px; text-align: center; font-size: 12px; color: #9ca3af; border-top: 1px solid #e5e7eb; }
        .btn { display: inline-block; background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600; margin-top: 25px; font-size: 14px; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>📅 New Interview Scheduled</h1>
        </div>
        <div class="content">
          <p style="color: #374151; font-size: 16px; margin-top: 0; line-height: 1.5;">
            Hello Admin,<br>A new candidate has successfully booked an interview slot.
          </p>
          
          <div class="info-card">
            <div class="info-row">
              <span class="label">Candidate: </span>
              <span class="value" style="color: #4f46e5;">${candidateEmail}</span>
            </div>
            <div class="info-row">
              <span class="label">Date: </span>
              <span class="value">${slotDate}</span>
            </div>
            <div class="info-row">
              <span class="label">Time: </span>
              <span class="value">${startTime} - ${endTime}</span>
            </div>
          </div>
        </div>
        <div class="footer">
          Automated notification • Please do not reply
        </div>
      </div>
    </body>
    </html>
`,
  };

  return transporter.sendMail(mailOptions);
};

exports.sendBookingEmailToCandidate = async ({
  candidateEmail,
  slotDate,
  startTime,
  endTime,
}) => {
  return transporter.sendMail({
    from: `"Interview Scheduler" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: "Interview Slot Confirmed",
    html: `
<div style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 40px 20px;">
  <div style="max-width: 500px; margin: 0 auto; background-color: white; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.05); overflow: hidden;">
    
    <div style="background-color: #2563eb; padding: 30px 20px; text-align: center;">
      <h2 style="color: white; margin: 0; font-size: 22px;">You're All Set! 🎉</h2>
    </div>

    <div style="padding: 30px;">
      <p style="color: #333; font-size: 16px; line-height: 1.5; margin-bottom: 25px;">
        Your interview has been confirmed. We've reserved this time specifically for you.
      </p>

      <div style="border-left: 4px solid #2563eb; background-color: #eff6ff; padding: 15px; border-radius: 4px;">
        <p style="margin: 0 0 10px 0; font-size: 15px; color: #1e3a8a;">
          <strong>📅 Date:</strong> ${slotDate}
        </p>
        <p style="margin: 0; font-size: 15px; color: #1e3a8a;">
          <strong>⏰ Time:</strong> ${startTime} - ${endTime}
        </p>
      </div>

      <p style="margin-top: 25px; color: #666; font-size: 14px;">
        Please make sure your camera and microphone are working before the call starts.
      </p>
    </div>

    <div style="padding: 20px; text-align: center; border-top: 1px solid #eee;">
      <p style="color: #999; font-size: 12px; margin: 0;">Automated message from Interview System</p>
    </div>
  </div>
</div>
`
  });
};


exports.sendCancelEmailToCandidate = async ({
  candidateEmail,
  slotDate,
  startTime,
  endTime,
}) => {
  return transporter.sendMail({
    from: `"Interview Scheduler" <${process.env.EMAIL_USER}>`,
    to: candidateEmail,
    subject: "Interview Booking Cancelled",
    html: `
<div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #ffffff; padding: 30px 10px;">
  <div style="max-width: 380px; margin: 0 auto; border: 1px solid #eee; border-radius: 10px; padding: 25px; text-align: center;">
    
    <div style="font-size: 32px; margin-bottom: 15px;">❌</div>

    <h3 style="color: #1f2937; margin: 0 0 10px 0; font-size: 20px;">Slot Cancelled</h3>
    
    <p style="color: #6b7280; font-size: 14px; margin: 0 0 20px 0; line-height: 1.4;">
      Your scheduled interview for <strong>${slotDate}</strong> has been cancelled by the administrator.
    </p>

    <div style="background-color: #fee2e2; color: #991b1b; padding: 10px; border-radius: 6px; font-size: 13px; font-weight: 600;">
      ${startTime} — ${endTime}
    </div>

    <p style="color: #9ca3af; font-size: 12px; margin-top: 20px;">
      Please contact the hiring team for next steps.
    </p>
  </div>
</div>
`,
  });
};


exports.sendInterviewReminderEmail = async ({
  candidateEmail,
  slotDate,
  startTime,
  endTime,
  meetingLink,
  interviewerName,
  interviewerRole,
  adminNote,
}) => {
  const subject = "Interview Reminder – Upcoming Interview";

  const html = `
<!DOCTYPE html>
<html>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f3f4f6;">
  
  <div style="padding: 40px 10px;">
    <div style="max-width: 450px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden;">
      
      <div style="padding: 24px 24px 0 24px; text-align: center;">
        <div style="background-color: #eef2ff; color: #4f46e5; width: 48px; height: 48px; border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto 16px auto; font-size: 24px; line-height: 48px;">
          🔔
        </div>
        <h2 style="margin: 0; font-size: 20px; font-weight: 700; color: #111827;">Interview Reminder</h2>
        <p style="margin: 8px 0 0 0; font-size: 14px; color: #6b7280;">You have an upcoming session scheduled.</p>
      </div>

      <div style="padding: 24px;">
        <div style="background-color: #f9fafb; border: 1px solid #e5e7eb; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <table width="100%" border="0" cellpadding="0" cellspacing="0">
            <tr>
              <td style="padding-bottom: 12px; border-bottom: 1px solid #e5e7eb;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; font-weight: 600;">Date</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1f2937; font-weight: 600;">${new Date(slotDate).toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</p>
              </td>
            </tr>
            <tr>
              <td style="padding-top: 12px;">
                <p style="margin: 0; font-size: 11px; text-transform: uppercase; letter-spacing: 0.5px; color: #9ca3af; font-weight: 600;">Time</p>
                <p style="margin: 4px 0 0 0; font-size: 15px; color: #1f2937; font-weight: 600;">${startTime} – ${endTime}</p>
              </td>
            </tr>
          </table>
        </div>

        ${interviewerName
      ? `<div style="margin-bottom: 16px;">
                 <p style="margin: 0; font-size: 12px; color: #6b7280;"><strong>Interviewer:</strong> ${interviewerName} <span style="color: #9ca3af;">(${interviewerRole || "Interviewer"})</span></p>
               </div>`
      : ""
    }

        ${adminNote
      ? `<div style="margin-bottom: 16px; background-color: #fffbeb; border: 1px solid #fcd34d; padding: 10px; border-radius: 6px;">
                 <p style="margin: 0; font-size: 13px; color: #92400e;"><strong>Note:</strong> ${adminNote}</p>
               </div>`
      : ""
    }

        <div style="margin-top: 24px;">
          ${meetingLink
      ? `<a href="${meetingLink}" style="display: block; width: 100%; background-color: #4f46e5; color: #ffffff; text-align: center; padding: 12px 0; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px;">Join Meeting</a>`
      : `<div style="background-color: #f3f4f6; color: #9ca3af; text-align: center; padding: 12px 0; border-radius: 6px; font-size: 14px; cursor: not-allowed;">Link will be shared soon</div>`
    }
        </div>
        
        <p style="margin: 16px 0 0 0; font-size: 12px; color: #6b7280; text-align: center;">
          Please join 10 minutes prior to start.
        </p>
      </div>

      <div style="background-color: #f9fafb; padding: 16px; text-align: center; border-top: 1px solid #e5e7eb;">
        <p style="margin: 0; font-size: 12px; color: #9ca3af; font-weight: 500;">GenkaiX Recruitment Team</p>
      </div>

    </div>
  </div>

</body>
</html>
`;

  await transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: candidateEmail,
    subject,
    html,
  });
};

exports.sendInterviewScheduleToInterviewer = async ({
  interviewerEmail,
  candidateEmail,
  slotDate,
  startTime,
  endTime,
  meetingLink,
}) => {
  const subject = "Interview Assigned – Candidate Schedule";

  const html = `
<!DOCTYPE html>
<html>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 0;">
  
  <div style="padding: 40px 20px;">
    <div style="max-width: 500px; margin: 0 auto; background-color: #ffffff; border-radius: 12px; box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); overflow: hidden; border: 1px solid #e2e8f0;">
      
      <div style="height: 6px; background: linear-gradient(to right, #6366f1, #8b5cf6); width: 100%;"></div>

      <div style="padding: 32px;">
        
        <h2 style="margin: 0 0 8px 0; font-size: 20px; color: #1e293b; font-weight: 700;">
          New Interview Assigned
        </h2>
        <p style="margin: 0 0 24px 0; font-size: 14px; color: #64748b;">
          You have been selected to conduct an interview.
        </p>

        <div style="background-color: #eff6ff; border: 1px solid #dbeafe; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0; font-size: 11px; text-transform: uppercase; font-weight: 700; color: #3b82f6; letter-spacing: 0.5px;">Candidate</p>
          <p style="margin: 4px 0 0 0; font-size: 16px; font-weight: 600; color: #1e3a8a;">
            ${candidateEmail}
          </p>
        </div>

        <div style="margin-bottom: 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" border="0">
            <tr>
              <td style="padding-bottom: 12px; vertical-align: top; width: 24px;">
                <span style="font-size: 16px;">📅</span>
              </td>
              <td style="padding-bottom: 12px;">
                <strong style="color: #334155; font-size: 14px;">Date:</strong> 
                <span style="color: #475569; font-size: 14px;">${new Date(slotDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}</span>
              </td>
            </tr>
            <tr>
              <td style="vertical-align: top; width: 24px;">
                <span style="font-size: 16px;">⏰</span>
              </td>
              <td>
                <strong style="color: #334155; font-size: 14px;">Time:</strong> 
                <span style="color: #475569; font-size: 14px;">${startTime} – ${endTime}</span>
              </td>
            </tr>
          </table>
        </div>

        ${
          meetingLink
            ? `<a href="${meetingLink}" style="display: block; width: 100%; background-color: #0f172a; color: #ffffff; text-align: center; padding: 14px 0; border-radius: 6px; text-decoration: none; font-weight: 600; font-size: 14px; transition: background-color 0.2s;">
                 Join Meeting Room
               </a>`
            : `<div style="text-align: center; padding: 12px; background-color: #f1f5f9; color: #94a3b8; border-radius: 6px; font-size: 13px;">Meeting link pending</div>`
        }

        <div style="margin-top: 24px; border-top: 1px solid #f1f5f9; padding-top: 16px;">
          <p style="margin: 0; font-size: 12px; color: #94a3b8; text-align: center;">
            GenkaiX Recruitment Team
          </p>
        </div>

      </div>
    </div>
  </div>
</body>
</html>
`;

  await transporter.sendMail({
    to: interviewerEmail,
    subject,
    html,
  });
};
