-- Create the database
CREATE DATABASE IF NOT EXISTS simple_hostel_db;

-- Use the database
USE simple_hostel_db;


-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  first_name VARCHAR(100) NOT NULL,
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
  role ENUM('admin', 'manager', 'employee') NOT NULL,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Create addresses table
CREATE TABLE IF NOT EXISTS addresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  house_number VARCHAR(10),
  street VARCHAR(255),
  city VARCHAR(255),
  postal_code VARCHAR(10),
  state VARCHAR(255),
  country VARCHAR(56),
  alpha_2_code VARCHAR(2),
  lat DECIMAL(9,6),
  lon DECIMAL(9,6),
  osm_id VARCHAR(20),
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create contact info table
CREATE TABLE IF NOT EXISTS contacts_info (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  phone_number VARCHAR(30),
  country_code VARCHAR(5),
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

-- Create reservation policies table
CREATE TABLE IF NOT EXISTS reservation_policies (
  property_id INT PRIMARY KEY,
  min_length_stay INT NOT NULL,
  max_length_stay INT NOT NULL,
  min_advance_booking INT NOT NULL,
  check_in_from VARCHAR(5),
  check_in_to VARCHAR(5),
  check_out_until VARCHAR(5),

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create join table for payment methods
CREATE TABLE IF NOT EXISTS property_payment_methods (
  id INT PRIMARY KEY AUTO_INCREMENT,
  property_id INT NOT NULL,
  payment_method VARCHAR(75) NOT NULL,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create advance payment policies table
CREATE TABLE IF NOT EXISTS advance_payment_policies (
  property_id INT PRIMARY KEY,
  advance_payment_required BOOLEAN DEFAULT false,
  deposit_amount DECIMAL(3,2) DEFAULT 0.00,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create Cancellation policies table
CREATE TABLE IF NOT EXISTS cancellation_policies (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  days_before_arrival INT NOT NULL,
  amount_refund DECIMAL(3,2) DEFAULT 0.00,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create children policies table
CREATE TABLE IF NOT EXISTS children_policies (
  property_id INT PRIMARY KEY,
  allow_children BOOLEAN DEFAULT false,
  children_min_age INT NOT NULL,
  minors_room_types ENUM('all_rooms', 'only_private', 'only_dorms'),
  free_stay_age INT DEFAULT 0,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create other policies table
CREATE TABLE IF NOT EXISTS other_policies (
  property_id INT PRIMARY KEY,
  quiet_hours_from VARCHAR(5),
  quiet_hours_to VARCHAR(5),
  smoking_areas BOOLEAN DEFAULT false,
  external_guest_allowed BOOLEAN DEFAULT false,
  pets_allowed BOOLEAN DEFAULT false,

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
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FULLTEXT(first_name, last_name),

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create reservations table.
CREATE TABLE IF NOT EXISTS reservations (
  id INT AUTO_INCREMENT PRIMARY KEY,
  guest_id INT NOT NULL,
  property_id INT NOT NULL,
  booking_source VARCHAR(50) NOT NULL,
  currency CHAR(3) NOT NULL,
  reservation_status VARCHAR(50) NOT NULL,
  payment_status VARCHAR(50) NOT NULL,
  advance_payment_amount DECIMAL(10,2),
  check_in DATE NOT NULL,
  check_out DATE NOT NULL,  
  special_request VARCHAR(500) DEFAULT NULL,
  created_by INT DEFAULT NULL,
  updated_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (guest_id) REFERENCES guests(id) ON DELETE CASCADE,
  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (updated_by) REFERENCES users(id) ON DELETE SET NULL
);

-- Create room types table.
CREATE TABLE IF NOT EXISTS room_types (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  description VARCHAR(100) NOT NULL,
  type VARCHAR(10) NOT NULL,
  gender VARCHAR(10) NOT NULL,
  max_occupancy INT NOT NULL CHECK (max_occupancy > 0),
  inventory INT NOT NULL CHECK (inventory > 0),
  status  BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- create reservation_rooms table
CREATE TABLE IF NOT EXISTS reservation_rooms (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  room_type_id INT NOT NULL,
  number_of_rooms INT CHECK (number_of_rooms > 0),
  total_amount DECIMAL(10,2) NOT NULL CHECK(total_amount > 0),

  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
);

-- Create products table.
CREATE TABLE IF NOT EXISTS products (
  id INT AUTO_INCREMENT PRIMARY KEY,
  room_type_id INT NOT NULL,
  room_name VARCHAR(100) NOT NULL,

  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE
);

-- Create beds table.
CREATE TABLE IF NOT EXISTS beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  product_id INT NOT NULL,
  bed_number INT NOT NULL,

  FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE
);

-- Create table assigned_beds
CREATE TABLE IF NOT EXISTS assigned_beds (
  id INT AUTO_INCREMENT PRIMARY KEY,
  reservation_id INT NOT NULL,
  bed_id INT NOT NULL,

  FOREIGN KEY (reservation_id) REFERENCES reservations(id) ON DELETE CASCADE,
  FOREIGN KEY (bed_id) REFERENCES beds(id) ON DELETE CASCADE
);

-- Create rates and availability table.
CREATE TABLE IF NOT EXISTS rates_and_availability(
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  room_type_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  custom_rate DECIMAL(10, 2) NOT NULL CHECK (custom_rate >= 0),
  rooms_to_sell  INT NOT NULL CHECK (rooms_to_sell >= 0),
  created_by INT DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
  FOREIGN KEY (created_by) REFERENCES users(id) ON DELETE SET NULL
  );

-- Create amenities table
CREATE TABLE IF NOT EXISTS amenities (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) UNIQUE
);

-- Create facilities table
CREATE TABLE IF NOT EXISTS facilities (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) UNIQUE,
  category VARCHAR(25)
);

-- Create amenities translations table
CREATE TABLE IF NOT EXISTS amenities_translations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  amenity_id INT,
  language_code VARCHAR(5),
  name VARCHAR(100),

  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE,
  UNIQUE (amenity_id, language_code)
);

-- Create facilities translation table
CREATE TABLE IF NOT EXISTS facilities_translations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  facility_id INT,
  language_code VARCHAR(5),
  name VARCHAR(100),

  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE,
  UNIQUE (facility_id, language_code)
);

-- Create room type amenities table
CREATE TABLE IF NOT EXISTS room_type_amenities (
  room_type_id INT,
  amenity_id INT,

  PRIMARY KEY (room_type_id, amenity_id),

  FOREIGN KEY (room_type_id) REFERENCES room_types(id) ON DELETE CASCADE,
  FOREIGN KEY (amenity_id) REFERENCES amenities(id) ON DELETE CASCADE
);

-- Create property facilities table
CREATE TABLE IF NOT EXISTS property_facilities (
  property_id INT,
  facility_id INT,

  PRIMARY KEY (property_id, facility_id),

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (facility_id) REFERENCES facilities(id) ON DELETE CASCADE
);

-- Create roomType images table
CREATE TABLE IF NOT EXISTS room_type_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  room_type_id INT NOT NULL,
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id),
  FOREIGN KEY (room_type_id) REFERENCES room_types(id)
);

-- Create property images table
CREATE TABLE IF NOT EXISTS property_images (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  file_name VARCHAR(255),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id)
);

-- Create features table
CREATE TABLE IF NOT EXISTS features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(50) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
);

-- Create property_features table
CREATE TABLE IF NOT EXISTS property_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  feature_id INT NOT NULL,
  enabled BOOLEAN NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);

-- Create plans table
CREATE TABLE IF NOT EXISTS plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(20) NOT NULL,
  price DECIMAL(10,2) NOT NULL,
);

-- Create plan_features
CREATE TABLE IF NOT EXISTS plan_features (
  id INT AUTO_INCREMENT PRIMARY KEY,
  plan_id INT NOT NULL,
  feature_id INT NOT NULL,

  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE,
  FOREIGN KEY (feature_id) REFERENCES features(id) ON DELETE CASCADE
);

--Create table property_plans
CREATE TABLE IF NOT EXISTS property_plans (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  plan_id INT NOT NULL,
  start_date DATE NOT NULL,
  end_date DATE,
  trial BOOLEAN DEFAULT false,
  is_active BOOLEAN NOT NULL DEFAULT true,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE,
  FOREIGN KEY (plan_id) REFERENCES plans(id) ON DELETE CASCADE
);

-- Create taxes and fees table
CREATE TABLE IF NOT EXISTS taxes_and_fees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL,
  name VARCHAR(50) NOT NULL,
  type ENUM("percentage", "fixed") NOT NULL,
  value DECIMAL(10,2) NOT NULL,
  per ENUM("booking", "night", "guest") DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- Create table breakfast_settings
CREATE TABLE IF NOT EXISTS breakfast_settings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  property_id INT NOT NULL UNIQUE,
  is_served BOOLEAN NOT NULL DEFAULT FALSE,
  is_included BOOLEAN DEFAULT NULL,
  price DECIMAL(10,2) DEFAULT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  FOREIGN KEY (property_id) REFERENCES properties(id) ON DELETE CASCADE
);

-- PROCEDURES
-- Create procedure for handle rates and availability insertions
DROP PROCEDURE IF EXISTS InsertOrUpdateRate;

DELIMITER //
CREATE PROCEDURE InsertOrUpdateRate(
  IN p_room_type_id INT,
  IN p_property_id INT,
  IN p_start_date DATE,
  IN p_end_date DATE,
  IN p_custom_rate DECIMAL(10,2),
  IN p_rooms_to_sell INT
)
BEGIN
  -- Declare necessary variables
  DECLARE id_var INT;
  DECLARE start_date_var, end_date_var DATE;
  DECLARE custom_rate_var DECIMAL(10,2);
  DECLARE rooms_to_sell_var INT;
  DECLARE existing_records INT DEFAULT 0;
  DECLARE exit_handler INT DEFAULT 0; -- Error flag

  -- Error handling: If an error occurs, set exit_handler to 1.
  DECLARE CONTINUE HANDLER FOR SQLEXCEPTION
  BEGIN
    SET exit_handler = 1;
    ROLLBACK;
  END;

  -- Start transaction
  START TRANSACTION;

  -- Delete exact overlapping record if needed
  DELETE FROM rates_and_availability
  WHERE room_type_id = p_room_type_id
  AND start_date >= p_start_date
  AND end_date <= p_end_date;

  -- Check for existing overlapping records
  SELECT COUNT(*)
  INTO existing_records
  FROM rates_and_availability
  WHERE room_type_id = p_room_type_id
    AND start_date <= p_end_date
    AND end_date >= p_start_date;

  IF existing_records > 0 THEN
    SELECT id, start_date, end_date, custom_rate, rooms_to_sell
    INTO id_var, start_date_var, end_date_var, custom_rate_var, rooms_to_sell_var
    FROM rates_and_availability
    WHERE room_type_id = p_room_type_id
      AND start_date < p_start_date
      AND end_date > p_end_date
    LIMIT 1;

    IF start_date_var IS NOT NULL AND end_date_var IS NOT NULL THEN
      -- Insert first half before the new range
      INSERT INTO rates_and_availability (room_type_id, property_id, start_date, end_date, custom_rate, rooms_to_sell)
      VALUES (p_room_type_id, p_property_id, start_date_var, DATE_SUB(p_start_date, INTERVAL 1 day), custom_rate_var, rooms_to_sell_var);

      -- Insert second half after the new range
      INSERT INTO rates_and_availability (room_type_id, property_id, start_date, end_date, custom_rate, rooms_to_sell)
      VALUES (p_room_type_id, p_property_id, DATE_ADD(p_end_date, INTERVAL 1 DAY), end_date_var, custom_rate_var, rooms_to_sell_var);

      -- Delete the original overlapping record
      DELETE FROM rates_and_availability
      WHERE id = id_var;
    END IF;


    -- Adjust previous range if needed
    UPDATE rates_and_availability
    SET end_date = DATE_SUB(p_start_date, INTERVAL 1 DAY)
    WHERE room_type_id = p_room_type_id
    AND start_date < p_start_date
    AND end_date >= p_start_date;

    -- Adjust following range if needed
    UPDATE rates_and_availability
    SET start_date = DATE_ADD(p_end_date, INTERVAL 1 DAY)
    WHERE room_type_id = p_room_type_id
    AND start_date <= p_end_date
    AND end_date > p_end_date;
  
  END IF;

  -- Insert new rate
  INSERT INTO rates_and_availability (room_type_id, property_id, start_date, end_date, custom_rate, rooms_to_sell)
  VALUES (p_room_type_id, p_property_id, p_start_date, p_end_date, p_custom_rate, p_rooms_to_sell);

  IF exit_handler = 0 THEN
    COMMIT;
  ELSE
    ROLLBACK;
  END IF;
  
END //
DELIMITER ;