-- Create the database
CREATE DATABASE IF NOT EXISTS simple_hostel_db;

-- Use the database
USE simple_hostel_db;


-- Create access control table
CREATE TABLE IF NOT EXISTS access_control (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  property_id INT NOT NULL,
  role ENUM("admin", "manager", "employee") NOT NULL,
  FOREIGN KEY (user_id) REFERENCES user(id),
  FOREIGN KEY (property_id) REFERENCES property(id) 
)

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
  updated_at TIMESTAMP NOT NULL CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create property table
CREATE TABLE IF NOT EXISTS property (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP NOT NULL CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  street VARCHAR(255),
  city VARCHAR(255),
  postal_code INT(20),
  country_code VARCHAR(2),
  FOREIGN KEY (property_id) REFERENCES property(id) ON DELETE CASCADE
);

-- Create contact info table
CREATE TABLE IF NOT EXISTS contact_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  phone_number VARCHAR(30),
  email VARCHAR(255),
  FOREIGN KEY (property_id) REFERENCES property(id) ON DELETE CASCADE
);

-- Create currencies table
CREATE TABLE IF NOT EXISTS currencies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  base_currency VARCHAR(3),
  payment_currency VARCHAR(3),
  FOREIGN KEY (property_id) REFERENCES property(id) ON DELETE CASCADE
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
  FOREIGN KEY (property_id) REFERENCES property(id) ON DELETE CASCADE
)

-- Create cancellation policies table.
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  days_before_check_in INT,
  amount_refound DECIMAL(3,2),
  FOREIGN KEY (property_id) REFERENCES property(id) ON DELETE CASCADE
)


-- Create room types table.

-- Create products table.

-- Create rates and availability table.

