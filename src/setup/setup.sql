-- Create the database
CREATE DATABASE IF NOT EXISTS simple_hostel_db;

-- Use the database
USE simple_hostel_db;


-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(70) NOT NULL,
  last_name VARCHAR(100),
  is_valid_email BOOLEAN NOT NULL,
  last_resend_email BIGINT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create property table
CREATE TABLE IF NOT EXISTS properties (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create access control table
CREATE TABLE IF NOT EXISTS access_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  role ENUM("admin", "manager", "employee") NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  street VARCHAR(255),
  city VARCHAR(255),
  postal_code INT(20),
  country_code VARCHAR(2),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create contact info table
CREATE TABLE IF NOT EXISTS contacts_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  phone_number VARCHAR(30),
  email VARCHAR(255),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  base_currency VARCHAR(3),
  payment_currency VARCHAR(3),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create policies table
CREATE TABLE IF NOT EXISTS policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  check_in_from TIME,
  check_in_to TIME,
  check_out_from TIME,
  check_out_to TIME,
  deposit_amount DECIMAL(3,2) DEFAULT 0.00,
  allow_cancellation BOOLEAN DEFAULT false,
  allow_pets BOOLEAN DEFAULT false,
  allow_minors BOOLEAN DEFAULT false,
  minors_room_types ENUM("all_rooms", "only_private_rooms"),
  description TEXT, 
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create cancellation policies table.
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  days_before_check_in INT,
  amount_refound DECIMAL(3,2),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create guest table
CREATE TABLE IF NOT EXISTS guests (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  first_name VARCHAR(255) NOT NULL,
  last_name VARCHAR(255) NOT NULL,
  id_number VARCHAR(25),
  email VARCHAR(255) NOT NULL,
  phone_number VARCHAR(15),
  city VARCHAR(255),
  street VARCHAR(255),
  postal_code VARCHAR(10),
  country_code VARCHAR(2),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create reservations table.
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_id INT NOT NULL,
  property_id INT NOT NULL,
  booking_source ENUM("booking.com", "hostelWorld.com", "direct", "website") NOT NULL,
  currencies CHAR(3) NOT NULL,
  reservation_status ENUM("confirmed", "provisional", "canceled", "no_show") NOT NULL,
  payment_status ENUM("pending", "canceled", "refunded", "paid", "partial") NOT NULL,
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,
  special_request VARCHAR(500) DEFAULT NULL,
  created_by INT NOT NULL,
  updated_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP

  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
)

-- create reservation_rooms table
CREATE TABLE IF NOT EXISTS reservation_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  room_type_id INT NOT NULL,
  number_of_guests INT CHECK (number_of_guests > 0),
  total_amount DECIMAL(10,2) CHECK (total_amount >= 0),

  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
)

-- Create room types table.

-- Create products table.

-- Create rates and availability table.

