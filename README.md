
# 📅 Interview Scheduler Web Application

A secure, role-based **Interview Scheduling System** that allows pre-approved candidates to book interview slots while giving admins full control over scheduling, bookings, and communication.

---

## 🚀 Live Demo

* **Frontend (Vercel):**
  👉 `https://interview-scheduler-eosin.vercel.app`

* **Backend (Render):**
  👉 `https://interview-scheduler-64c7.onrender.com/`

---

## 🧑‍💻 Tech Stack

### Frontend

* React (Vite)
* React Router
* Axios
* Tailwind CSS / Custom CSS

### Backend

* Node.js
* Express.js
* MySQL
* JWT Authentication
* Nodemailer (Email notifications)

### Deployment

* Frontend: **Vercel**
* Backend: **Render**
* Database: **Railway MySQL (Public TCP Proxy)**

---

## 🔐 User Roles

### 👨‍💼 Admin

* Login with email & password
* Create / delete interview slots
* Freeze / unfreeze slots
* View all bookings
* Cancel or reschedule bookings
* Assign interviewer & meeting link
* Send reminder emails
* Whitelist / remove candidate emails
* View admin activity logs

### 👤 Candidate

* Login using **whitelisted email only**
* View available interview slots
* Book **only one** slot
* View interview details
* Receive email notifications:

  * Booking confirmation
  * Cancellation
  * Interviewer assignment

---

## 🗂️ Project Structure

```
scheduler-backend/
├── controller/
│   ├── authController.js
│   ├── adminController.js
│   └── candidateController.js
├── routes/
│   ├── authRoutes.js
│   ├── adminRoutes.js
│   └── candidateRoutes.js
├── middleware/
│   └── authMiddleware.js
├── utils/
│   ├── mailer.js
│   └── adminLogger.js
├── config/
│   └── db.js
├── server.js
├── package.json
└── db.sql
```

---

## 🧾 Database Design

### Core Tables

* `admin`
* `whitelisted_email`
* `interview_slots`
* `interview_bookings`
* `admin_activity_logs`

### Key Constraints

* One booking per candidate
* One booking per slot
* Foreign keys with cascading rules
* Slot conflict prevention using unique constraints

---


Create variables in **Render Dashboard**:

```env
DB_HOST=shuttle.proxy.rlwy.net
DB_PORT=XXXXX
DB_USER=root
DB_PASSWORD=********
DB_NAME=railway

JWT_SECRET=your_jwt_secret

EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_app_password
ADMIN_EMAIL=admin_email@gmail.com
```

> ⚠️ `DB_PORT` must be taken from **Railway → MySQL → Public Network**

---

## 🧪 API Overview

### Auth

* `POST /auth/admin-login`
* `POST /auth/candidate-login`

### Admin

* `POST /admin/slots`
* `GET /admin/slots`
* `DELETE /admin/slots/:id`
* `PUT /admin/slots/:id/toggle`
* `GET /admin/interview-bookings`
* `PUT /admin/interviews/:bookingId/assign`
* `POST /admin/interviews/:bookingId/reminder`
* `DELETE /admin/interviews/:bookingId/cancel`
* `POST /admin/whitelist`
* `GET /admin/whitelist`
* `DELETE /admin/whitelist/:id`
* `GET /admin/activity-logs`

### Candidate

* `GET /candidate/slots`
* `POST /candidate/book-slot`
* `GET /candidate/interview-details`

---

## 📧 Email Notifications

Automated emails are sent when:

* Candidate books a slot
* Admin cancels booking
* Interviewer is assigned
* Admin sends reminder

Handled using **Nodemailer + Gmail SMTP**.

---

## 🧠 Key Design Decisions

* **Email whitelisting** instead of registration
* **JWT-based authentication**
* **Role-based access control**
* **Public DB proxy** for cross-platform deployment
* **Activity logs** for admin audit trail
* **Simple RESTful architecture**

---

## 🧪 How to Run Locally

### Backend

```bash
cd scheduler-backend
npm install
npm start
```

### Frontend

```bash
cd scheduler-frontend
npm install
npm run dev
```

---

## 🧠 Interview Talking Points

* Secure access using whitelisted emails
* Prevented slot conflicts at DB + API level
* Implemented admin activity logging
* Handled real-world deployment networking issues
* Email-based communication flow
* Clean separation of concerns

---

## 👤 Author

**Gaurav**
Intern @ GenkaiX Software
Backend / Full-Stack Developer

j
