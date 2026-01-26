CREATE DATABASE genkaix_task_2_interview_scheduler
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE genkaix_task_2_interview_scheduler;


CREATE TABLE admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE whitelisted_email (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    added_by_admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_whitelisted_email_admin
        FOREIGN KEY (added_by_admin_id)
        REFERENCES admin(id)
        ON DELETE RESTRICT
);



CREATE TABLE interview_slots (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    created_by_admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_slots_admin
        FOREIGN KEY (created_by_admin_id)
        REFERENCES admin(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_slot_time
        UNIQUE (slot_date, start_time, end_time)
);


CREATE TABLE interview_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL UNIQUE,
    whitelisted_email_id INT NOT NULL UNIQUE,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_slot
        FOREIGN KEY (slot_id)
        REFERENCES interview_slots(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_whitelisted_email
        FOREIGN KEY (whitelisted_email_id)
        REFERENCES whitelisted_email(id)
        ON DELETE CASCADE
);



CREATE INDEX idx_whitelisted_email_email
ON whitelisted_email(email);

CREATE INDEX idx_slot_availability
ON interview_slots(is_booked, slot_date);




INSERT INTO users (full_name, email, password)
VALUES (
  'Admin Genkaix',
  'admin@genkaix.com',
  '$2b$10$hashed_password_here',

);

