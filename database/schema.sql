CREATE TABLE users (
  id INT PRIMARY KEY AUTO_INCREMENT,
  username VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN NOT NULL DEFAULT FALSE,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  INDEX idx_email (email) --for faster lookups during login/authentication
);


CREATE TABLE parking_lots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  location VARCHAR(150) NOT NULL,
  admin_id INT NOT NULL,
  total_capacity INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_parking_lot_admin
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

CREATE TABLE parking_slots (
  id INT PRIMARY KEY AUTO_INCREMENT,
  parking_lot_id INT NOT NULL,
  slot_number VARCHAR(20) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'available' 
    CHECK (status IN ('available', 'reserved', 'occupied', 'under_maintenance')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_slot_parking_lot
    FOREIGN KEY (parking_lot_id) REFERENCES parking_lots(id) ON DELETE CASCADE, --so that deleting a parking lot removes all its slots

  CONSTRAINT uq_lot_slot UNIQUE (parking_lot_id, slot_number)
  INDEX idx_slot_status (status), --added index for faster filtering
  INDEX idx_slot_lot_status (parking_lot_id, status) --for finding available slots in a specific lot
);

CREATE TABLE reservations (
  id INT PRIMARY KEY AUTO_INCREMENT,
  user_id INT NOT NULL,
  parking_slot_id INT NOT NULL,
  start_time DATETIME NOT NULL,
  end_time DATETIME NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'active' --so that new reservations are automatically active
    CHECK (status IN ('active', 'cancelled', 'completed')),
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

  CONSTRAINT fk_reservation_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE, --if user s deleted, so are their reservations

  CONSTRAINT fk_reservation_slot
    FOREIGN KEY (parking_slot_id) REFERENCES parking_slots(id), --if slot  is deleted, so are its reservations

  CONSTRAINT chk_time_valid
    CHECK (end_time > start_time), --ensure end time is always after start time

  INDEX idx_reservation_user_status (user_id, status), --to quickly find all active reservations for a user
  INDEX idx_reservation_slot_time (parking_slot_id, start_time, end_time) --useful for queries checking if a slot is available during a time range
);