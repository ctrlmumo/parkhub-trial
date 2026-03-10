

-- USERS TABLE
CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  phone_number VARCHAR(20),
  
  -- Role system
  role ENUM('driver', 'manager', 'admin') NOT NULL DEFAULT 'driver',
  status ENUM('active', 'banned', 'suspended') NOT NULL DEFAULT 'active',
  
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Indexes
  INDEX idx_email (email),
  INDEX idx_role (role),
  INDEX idx_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PARKING LOTS TABLE
CREATE TABLE parking_lots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(255) NOT NULL,
  
  
  -- Manager/Owner
  manager_id INT NOT NULL,
  
  -- Capacity
  total_capacity INT NOT NULL DEFAULT 0,
  
  -- Pricing
  hourly_rate DECIMAL(10,2) NOT NULL DEFAULT 50.00,
  
  -- Operating Hours
  is_24_7 BOOLEAN NOT NULL DEFAULT TRUE,
  open_time TIME,
  close_time TIME,
  
  -- Amenities (JSON)
  amenities JSON,
  
  -- Status
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  
  -- Location Coordinates
  latitude DECIMAL(10, 8),
  longitude DECIMAL(11, 8),
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_lot_manager
    FOREIGN KEY (manager_id) REFERENCES users(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_manager (manager_id),
  INDEX idx_location (latitude, longitude),
  INDEX idx_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PARKING SLOTS TABLE
CREATE TABLE parking_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parking_lot_id INT NOT NULL,
  slot_number VARCHAR(20) NOT NULL,
  
  -- Section
  section VARCHAR(10),
  
  -- Status
  status ENUM('available', 'occupied', 'reserved', 'maintenance') NOT NULL DEFAULT 'available',
  
  -- Special features
  is_ev_charging BOOLEAN NOT NULL DEFAULT FALSE,
  is_disabled_friendly BOOLEAN NOT NULL DEFAULT FALSE,
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_slot_parking_lot
    FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE,
  
  -- Unique Constraint
  CONSTRAINT uq_lot_slot UNIQUE (parking_lot_id, slot_number),
  
  -- Indexes
  INDEX idx_slot_status (status),
  INDEX idx_slot_lot_status (parking_lot_id, status),
  INDEX idx_slot_section (section)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- BOOKINGS TABLE 
CREATE TABLE bookings (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- User and Slot
  user_id INT NOT NULL,
  parking_slot_id INT NOT NULL,
  
  -- Time
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  duration_hours INT NOT NULL,
  
  -- Vehicle
  vehicle_number VARCHAR(20) NOT NULL,
  
  -- Pricing
  hourly_rate DECIMAL(10,2) NOT NULL,
  total_amount DECIMAL(10,2) NOT NULL,
  
  -- Booking Reference
  booking_reference VARCHAR(20) NOT NULL UNIQUE,
  
  -- Status
  status ENUM('active', 'completed', 'cancelled') NOT NULL DEFAULT 'active',
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_booking_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  CONSTRAINT fk_booking_slot
    FOREIGN KEY (parking_slot_id) REFERENCES parking_slots(id) ON DELETE CASCADE,
  
  -- Constraints
  CONSTRAINT chk_time_valid
    CHECK (end_time > start_time),
  
  CONSTRAINT chk_duration_positive
    CHECK (duration_hours > 0),
  
  -- Indexes
  INDEX idx_booking_user_status (user_id, status),
  INDEX idx_booking_slot_time (parking_slot_id, start_time, end_time),
  INDEX idx_booking_reference (booking_reference),
  INDEX idx_booking_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- PAYMENTS TABLE
CREATE TABLE payments (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- Booking
  booking_id INT NOT NULL,
  
  -- Amount
  amount DECIMAL(10,2) NOT NULL,
  
  -- Payment Method
  payment_method ENUM('mpesa', 'card', 'cash') NOT NULL,
  
  -- Payment Status
  status ENUM('pending', 'completed', 'failed') NOT NULL DEFAULT 'pending',
  
  -- Transaction Details
  transaction_id VARCHAR(100),
  mpesa_receipt VARCHAR(100),
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_payment_booking
    FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE CASCADE,
  
  -- Indexes
  INDEX idx_payment_booking (booking_id),
  INDEX idx_payment_status (status),
  INDEX idx_payment_method (payment_method),
  INDEX idx_transaction_id (transaction_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- REVIEWS TABLE
CREATE TABLE reviews (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- User and Parking Lot
  user_id INT NOT NULL,
  parking_lot_id INT NOT NULL,
  
  -- Rating and Comment
  rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  comment TEXT,
  
  -- Manager Response
  manager_response TEXT,
  responded_at DATETIME,
  
  -- Timestamps
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_review_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  
  CONSTRAINT fk_review_lot
    FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE,
  
  -- Unique Constraint (one review per user per lot)
  CONSTRAINT uq_user_lot_review UNIQUE (user_id, parking_lot_id),
  
  -- Indexes
  INDEX idx_review_lot (parking_lot_id),
  INDEX idx_review_rating (rating)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- SYSTEM SETTINGS TABLE
CREATE TABLE system_settings (
  setting_key VARCHAR(100) PRIMARY KEY,
  setting_value TEXT NOT NULL,
  description TEXT,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- AUDIT LOGS TABLE
CREATE TABLE audit_logs (
  id INT PRIMARY KEY AUTO_INCREMENT,
  
  -- User who performed action
  user_id INT,
  
  -- Action Details
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id INT,
  
  -- Details (JSON)
  details JSON,
  
  -- IP Address
  ip_address VARCHAR(45),
  
  -- Timestamp
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  
  -- Foreign Keys
  CONSTRAINT fk_log_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
  
  -- Indexes
  INDEX idx_log_user (user_id),
  INDEX idx_log_action (action),
  INDEX idx_log_entity (entity_type, entity_id),
  INDEX idx_log_created (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;


-- INSERT DEFAULT SYSTEM SETTINGS
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('platform_name', 'ParkHub', 'Platform name'),
('default_hourly_rate', '50', 'Default hourly parking rate (KES)'),
('commission_rate', '10', 'Platform commission rate (%)'),
('mpesa_paybill', '123456', 'M-Pesa paybill number'),
('support_email', 'support@parkhub.com', 'Support email address'),
('min_booking_hours', '1', 'Minimum booking duration (hours)'),
('max_booking_hours', '24', 'Maximum booking duration (hours)');
