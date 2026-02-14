-- VoiceTriage AI - Complete Database Schema

-- 1. Create Database if not exists
CREATE DATABASE IF NOT EXISTS voicetriage_db;
USE voicetriage_db;

-- 2. Users Table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'doctor', 'nurse', 'receptionist', 'patient', 'kiosk') NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Patients Table (Stores Intake Data)
CREATE TABLE IF NOT EXISTS patients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(255),
  age INT,
  gender VARCHAR(50), 
  symptoms TEXT,
  transcribed_text TEXT,
  priority_score INT DEFAULT 0,
  triage_category ENUM('green', 'yellow', 'red') DEFAULT 'green',
  status ENUM('waiting', 'with_nurse', 'with_doctor', 'discharged') DEFAULT 'waiting',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Vitals Table (Linked to Patient)
CREATE TABLE IF NOT EXISTS vitals (
  id INT AUTO_INCREMENT PRIMARY KEY,
  patient_id INT,
  bp_systolic INT,
  bp_diastolic INT,
  temperature DECIMAL(5,2),
  heart_rate INT,
  spo2 INT,
  recorded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE
);

-- 5. Insert Default Users (Optional - for manual setup)
-- Passwords in database are hashed, so these raw inserts won't work for login unless backend hashes them first.
-- Use the 'Login' page to auto-register users.
