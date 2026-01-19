CREATE DATABASE genkaix_task_2_interview_scheduler
  CHARACTER SET utf8mb4
  COLLATE utf8mb4_unicode_ci;

USE genkaix_task_2_interview_scheduler;


CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('ADMIN', 'CANDIDATE') NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);


CREATE TABLE allowed_emails (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL UNIQUE,
    added_by_admin_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_allowed_emails_admin
        FOREIGN KEY (added_by_admin_id)
        REFERENCES users(id)
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
        REFERENCES users(id)
        ON DELETE RESTRICT,

    CONSTRAINT uq_slot_time UNIQUE (slot_date, start_time, end_time)
);


CREATE TABLE interview_bookings (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slot_id INT NOT NULL UNIQUE,
    candidate_id INT NOT NULL UNIQUE,
    booked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT fk_booking_slot
        FOREIGN KEY (slot_id)
        REFERENCES interview_slots(id)
        ON DELETE CASCADE,

    CONSTRAINT fk_booking_candidate
        FOREIGN KEY (candidate_id)
        REFERENCES users(id)
        ON DELETE CASCADE
);


CREATE INDEX idx_allowed_email
ON allowed_emails(email);

CREATE INDEX idx_slot_availability
ON interview_slots(is_booked, slot_date);



INSERT INTO users (full_name, email, password, role)
VALUES (
  'Admin Genkaix',
  'admin@genkaix.com',
  '$2b$10$hashed_password_here',
  'ADMIN'
);

