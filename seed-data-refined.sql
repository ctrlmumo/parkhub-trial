-- ============================================================================
-- ParkHub Seed Data (Comprehensive)
-- ============================================================================
-- Includes: Users (all roles), Parking Lots, Slots, Bookings, Payments, Reviews
-- ============================================================================

USE parkhub_db;

-- ============================================================================
-- USERS
-- ============================================================================
-- Password: 'password123' (hashed with bcrypt)
-- Hash: $2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW

-- ============================================================================
-- USERS
-- ============================================================================
-- Password: 'password123' (hashed with bcrypt)
-- Note: Django uses 'date_joined' instead of 'created_at' for users
-- We also need to provide 'updated_at' as it is required by the model

INSERT INTO users (username, email, password, phone_number, role, status, date_joined, updated_at, first_name, last_name, is_staff, is_superuser, is_active) VALUES
-- Admins (3)
('Admin User', 'admin@demo.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254700000001', 'admin', 'active', '2024-01-01 10:00:00', '2024-01-01 10:00:00', 'Admin', 'User', 1, 1, 1),
('Sarah Admin', 'sarah.admin@parkhub.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254700000002', 'admin', 'active', '2024-01-05 09:00:00', '2024-01-05 09:00:00', 'Sarah', 'Admin', 1, 1, 1),
('Mike Admin', 'mike.admin@parkhub.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254700000003', 'admin', 'active', '2024-01-10 11:00:00', '2024-01-10 11:00:00', 'Mike', 'Admin', 1, 1, 1),

-- Managers (5)
('Demo Manager', 'manager@demo.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254711000001', 'manager', 'active', '2024-02-01 08:00:00', '2024-02-01 08:00:00', 'Demo', 'Manager', 0, 0, 1),
('Jane Manager', 'jane.manager@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254711000002', 'manager', 'active', '2024-02-05 10:00:00', '2024-02-05 10:00:00', 'Jane', 'Manager', 0, 0, 1),
('Robert Manager', 'robert.manager@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254711000003', 'manager', 'active', '2024-02-10 09:00:00', '2024-02-10 09:00:00', 'Robert', 'Manager', 0, 0, 1),
('Linda Manager', 'linda.manager@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254711000004', 'manager', 'active', '2024-02-15 11:00:00', '2024-02-15 11:00:00', 'Linda', 'Manager', 0, 0, 1),
('David Manager', 'david.manager@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254711000005', 'manager', 'active', '2024-02-20 10:00:00', '2024-02-20 10:00:00', 'David', 'Manager', 0, 0, 1),

-- Drivers (12)
('Demo Driver', 'driver@demo.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254712345678', 'driver', 'active', '2024-03-01 08:00:00', '2024-03-01 08:00:00', 'Demo', 'Driver', 0, 0, 1),
('John Doe', 'john.doe@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000001', 'driver', 'active', '2024-03-05 09:00:00', '2024-03-05 09:00:00', 'John', 'Doe', 0, 0, 1),
('Emily Smith', 'emily.smith@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000002', 'driver', 'active', '2024-03-10 10:00:00', '2024-03-10 10:00:00', 'Emily', 'Smith', 0, 0, 1),
('Michael Brown', 'michael.brown@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000003', 'driver', 'active', '2024-03-15 08:00:00', '2024-03-15 08:00:00', 'Michael', 'Brown', 0, 0, 1),
('Jessica Wilson', 'jessica.wilson@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000004', 'driver', 'active', '2024-03-20 11:00:00', '2024-03-20 11:00:00', 'Jessica', 'Wilson', 0, 0, 1),
('Chris Taylor', 'chris.taylor@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000005', 'driver', 'active', '2024-03-25 09:00:00', '2024-03-25 09:00:00', 'Chris', 'Taylor', 0, 0, 1),
('Amanda Lee', 'amanda.lee@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000006', 'driver', 'active', '2024-04-01 10:00:00', '2024-04-01 10:00:00', 'Amanda', 'Lee', 0, 0, 1),
('Daniel Martinez', 'daniel.martinez@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000007', 'driver', 'active', '2024-04-05 08:00:00', '2024-04-05 08:00:00', 'Daniel', 'Martinez', 0, 0, 1),
('Sophia Garcia', 'sophia.garcia@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000008', 'driver', 'active', '2024-04-10 09:00:00', '2024-04-10 09:00:00', 'Sophia', 'Garcia', 0, 0, 1),
('Matthew Anderson', 'matthew.anderson@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000009', 'driver', 'active', '2024-04-15 11:00:00', '2024-04-15 11:00:00', 'Matthew', 'Anderson', 0, 0, 1),
('Olivia Thomas', 'olivia.thomas@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000010', 'driver', 'active', '2024-04-20 10:00:00', '2024-04-20 10:00:00', 'Olivia', 'Thomas', 0, 0, 1),
('James Jackson', 'james.jackson@example.com', '$2b$10$rZ0qKE3YpLN8wH9yRx6jYOvY.5xZqK3nV8L9xF2tQ7pM4sN6oP8qW', '254720000011', 'driver', 'banned', '2024-04-25 09:00:00', '2024-04-25 09:00:00', 'James', 'Jackson', 0, 0, 1);


-- ============================================================================
-- PARKING LOTS
-- ============================================================================
INSERT INTO parking_lots (name, location, manager_id, total_capacity, hourly_rate, is_24_7, open_time, close_time, amenities, latitude, longitude, is_active, created_at, updated_at) VALUES
-- Manager 4's lots
('Main Campus Parking', 'University Way, Nairobi', 4, 80, 50.00, TRUE, NULL, NULL, '["24/7 Security", "Covered Parking", "CCTV", "Lighting"]', -1.2921, 36.8219, TRUE, '2024-02-15 08:00:00', '2024-02-15 08:00:00'),
('Library Parking Lot', 'Library Road, Nairobi', 4, 48, 45.00, FALSE, '06:00:00', '22:00:00', '["Security", "Well-lit", "Close to Library"]', -1.2935, 36.8225, TRUE, '2024-02-20 09:00:00', '2024-02-20 09:00:00'),

-- Manager 5's lots
('Westlands Mall Parking', 'Westlands, Nairobi', 5, 120, 60.00, TRUE, NULL, NULL, '["Shopping Mall", "Covered", "EV Charging", "Car Wash"]', -1.2676, 36.8108, TRUE, '2024-03-01 10:00:00', '2024-03-01 10:00:00'),
('Karen Business Park', 'Karen, Nairobi', 5, 60, 55.00, FALSE, '07:00:00', '19:00:00', '["Security Gate", "Reserved Slots", "CCTV"]', -1.3194, 36.7073, TRUE, '2024-03-05 08:00:00', '2024-03-05 08:00:00'),

-- Manager 6's lot
('Airport Terminal Parking', 'JKIA, Nairobi', 6, 200, 80.00, TRUE, NULL, NULL, '["24/7 Access", "Shuttle Service", "Security", "Covered Areas"]', -1.3192, 36.9258, TRUE, '2024-03-10 07:00:00', '2024-03-10 07:00:00'),

-- Manager 7's lot  
('CBD Central Parking', 'Kenyatta Avenue, Nairobi CBD', 7, 40, 70.00, FALSE, '06:00:00', '20:00:00', '["Central Location", "Security", "Lighting"]', -1.2864, 36.8172, TRUE, '2024-03-15 09:00:00', '2024-03-15 09:00:00'),

-- Manager 8's lot
('Residential Complex Parking', 'Kilimani, Nairobi', 8, 35, 40.00, TRUE, NULL, NULL, '["Gated", "Resident Priority", "Visitor Slots"]', -1.2969, 36.7825, TRUE, '2024-03-20 10:00:00', '2024-03-20 10:00:00');

-- ============================================================================
-- PARKING SLOTS
-- ============================================================================

-- Main Campus Parking (Lot 1) - 80 slots (Sections A, B, C, D - 20 each)
INSERT INTO parking_slots (parking_lot_id, slot_number, section, status, is_ev_charging, is_disabled_friendly, created_at, updated_at) VALUES
-- Section A
(1, 'A01', 'A', 'available', FALSE, TRUE, NOW(), NOW()), (1, 'A02', 'A', 'occupied', FALSE, FALSE, NOW(), NOW()),
(1, 'A03', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A04', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'A05', 'A', 'reserved', FALSE, FALSE, NOW(), NOW()), (1, 'A06', 'A', 'available', TRUE, FALSE, NOW(), NOW()),
(1, 'A07', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A08', 'A', 'occupied', FALSE, FALSE, NOW(), NOW()),
(1, 'A09', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A10', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'A11', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A12', 'A', 'available', FALSE, TRUE, NOW(), NOW()),
(1, 'A13', 'A', 'occupied', FALSE, FALSE, NOW(), NOW()), (1, 'A14', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'A15', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A16', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'A17', 'A', 'reserved', FALSE, FALSE, NOW(), NOW()), (1, 'A18', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'A19', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'A20', 'A', 'maintenance', FALSE, FALSE, NOW(), NOW()),

-- Section B (similar pattern - 20 slots)
(1, 'B01', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B02', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'B03', 'B', 'occupied', FALSE, FALSE, NOW(), NOW()), (1, 'B04', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'B05', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B06', 'B', 'available', TRUE, FALSE, NOW(), NOW()),
(1, 'B07', 'B', 'reserved', FALSE, FALSE, NOW(), NOW()), (1, 'B08', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'B09', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B10', 'B', 'available', FALSE, TRUE, NOW(), NOW()),
(1, 'B11', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B12', 'B', 'occupied', FALSE, FALSE, NOW(), NOW()),
(1, 'B13', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B14', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'B15', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B16', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'B17', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B18', 'B', 'reserved', FALSE, FALSE, NOW(), NOW()),
(1, 'B19', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'B20', 'B', 'available', FALSE, FALSE, NOW(), NOW()),

-- Section C (20 slots)
(1, 'C01', 'C', 'occupied', FALSE, FALSE, NOW(), NOW()), (1, 'C02', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C03', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C04', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C05', 'C', 'available', FALSE, TRUE, NOW(), NOW()), (1, 'C06', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C07', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C08', 'C', 'reserved', FALSE, FALSE, NOW(), NOW()),
(1, 'C09', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C10', 'C', 'available', TRUE, FALSE, NOW(), NOW()),
(1, 'C11', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C12', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C13', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C14', 'C', 'occupied', FALSE, FALSE, NOW(), NOW()),
(1, 'C15', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C16', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C17', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C18', 'C', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'C19', 'C', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'C20', 'C', 'available', FALSE, FALSE, NOW(), NOW()),

-- Section D (20 slots)
(1, 'D01', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D02', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D03', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D04', 'D', 'occupied', FALSE, FALSE, NOW(), NOW()),
(1, 'D05', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D06', 'D', 'available', FALSE, TRUE, NOW(), NOW()),
(1, 'D07', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D08', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D09', 'D', 'reserved', FALSE, FALSE, NOW(), NOW()), (1, 'D10', 'D', 'available', TRUE, FALSE, NOW(), NOW()),
(1, 'D11', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D12', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D13', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D14', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D15', 'D', 'occupied', FALSE, FALSE, NOW(), NOW()), (1, 'D16', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D17', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D18', 'D', 'available', FALSE, FALSE, NOW(), NOW()),
(1, 'D19', 'D', 'available', FALSE, FALSE, NOW(), NOW()), (1, 'D20', 'D', 'available', FALSE, FALSE, NOW(), NOW());

-- Library Parking (Lot 2) - 48 slots (Sections A, B - 24 each)
-- Section A
INSERT INTO parking_slots (parking_lot_id, slot_number, section, status, is_ev_charging, is_disabled_friendly, created_at, updated_at) VALUES
(2, 'A01', 'A', 'available', FALSE, TRUE, NOW(), NOW()), (2, 'A02', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A03', 'A', 'occupied', FALSE, FALSE, NOW(), NOW()), (2, 'A04', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A05', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A06', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A07', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A08', 'A', 'reserved', FALSE, FALSE, NOW(), NOW()),
(2, 'A09', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A10', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A11', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A12', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A13', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A14', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A15', 'A', 'occupied', FALSE, FALSE, NOW(), NOW()), (2, 'A16', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A17', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A18', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A19', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A20', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A21', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A22', 'A', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'A23', 'A', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'A24', 'A', 'available', FALSE, FALSE, NOW(), NOW()),

-- Section B
(2, 'B01', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B02', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B03', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B04', 'B', 'available', FALSE, TRUE, NOW(), NOW()),
(2, 'B05', 'B', 'occupied', FALSE, FALSE, NOW(), NOW()), (2, 'B06', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B07', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B08', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B09', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B10', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B11', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B12', 'B', 'reserved', FALSE, FALSE, NOW(), NOW()),
(2, 'B13', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B14', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B15', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B16', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B17', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B18', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B19', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B20', 'B', 'available', FALSE, FALSE, NOW(), NOW()),
(2, 'B21', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B22', 'B', 'occupied', FALSE, FALSE, NOW(), NOW()),
(2, 'B23', 'B', 'available', FALSE, FALSE, NOW(), NOW()), (2, 'B24', 'B', 'available', FALSE, FALSE, NOW(), NOW());

-- Note: For brevity, not creating all slots for lots 3-7
-- In production, you would create slots for all parking lots

-- ============================================================================
-- BOOKINGS
-- ============================================================================
INSERT INTO bookings (user_id, parking_slot_id, start_time, end_time, duration_hours, vehicle_number, hourly_rate, total_amount, booking_reference, status, created_at, updated_at) VALUES
-- Completed bookings
(9, 2, '2026-02-10 08:00:00', '2026-02-10 10:00:00', 2, 'KCA 123A', 50.00, 100.00, 'BK20260210001', 'completed', '2026-02-10 07:45:00', '2026-02-10 07:45:00'),
(10, 13, '2026-02-11 09:00:00', '2026-02-11 12:00:00', 3, 'KCB 456B', 50.00, 150.00, 'BK20260211001', 'completed', '2026-02-11 08:50:00', '2026-02-11 08:50:00'),
(11, 21, '2026-02-12 10:00:00', '2026-02-12 14:00:00', 4, 'KCC 789C', 50.00, 200.00, 'BK20260212001', 'completed', '2026-02-12 09:55:00', '2026-02-12 09:55:00'),
(12, 41, '2026-02-13 11:00:00', '2026-02-13 13:00:00', 2, 'KCD 012D', 50.00, 100.00, 'BK20260213001', 'completed', '2026-02-13 10:50:00', '2026-02-13 10:50:00'),
(13, 61, '2026-02-14 08:30:00', '2026-02-14 11:30:00', 3, 'KCE 345E', 50.00, 150.00, 'BK20260214001', 'completed', '2026-02-14 08:20:00', '2026-02-14 08:20:00'),

-- Active bookings (currently ongoing)
(14, 5, '2026-02-24 08:00:00', '2026-02-24 12:00:00', 4, 'KCF 678F', 50.00, 200.00, 'BK20260224001', 'active', '2026-02-24 07:50:00', '2026-02-24 07:50:00'),
(15, 17, '2026-02-24 09:00:00', '2026-02-24 11:00:00', 2, 'KCG 901G', 50.00, 100.00, 'BK20260224002', 'active', '2026-02-24 08:55:00', '2026-02-24 08:55:00'),
(16, 28, '2026-02-24 10:00:00', '2026-02-24 15:00:00', 5, 'KCH 234H', 50.00, 250.00, 'BK20260224003', 'active', '2026-02-24 09:50:00', '2026-02-24 09:50:00'),
(17, 48, '2026-02-24 07:00:00', '2026-02-24 10:00:00', 3, 'KCI 567I', 50.00, 150.00, 'BK20260224004', 'active', '2026-02-24 06:55:00', '2026-02-24 06:55:00'),
(18, 68, '2026-02-24 11:00:00', '2026-02-24 14:00:00', 3, 'KCJ 890J', 50.00, 150.00, 'BK20260224005', 'active', '2026-02-24 10:50:00', '2026-02-24 10:50:00'),

-- Reserved bookings (future)
(10, 7, '2026-02-25 08:00:00', '2026-02-25 12:00:00', 4, 'KCB 456B', 50.00, 200.00, 'BK20260225001', 'reserved', '2026-02-24 15:00:00', '2026-02-24 15:00:00'),
(11, 18, '2026-02-25 10:00:00', '2026-02-25 13:00:00', 3, 'KCC 789C', 50.00, 150.00, 'BK20260225002', 'reserved', '2026-02-24 16:00:00', '2026-02-24 16:00:00'),
(9, 9, '2026-02-26 09:00:00', '2026-02-26 11:00:00', 2, 'KCA 123A', 50.00, 100.00, 'BK20260226001', 'reserved', '2026-02-24 17:00:00', '2026-02-24 17:00:00'),

-- Cancelled booking
(19, 12, '2026-02-15 10:00:00', '2026-02-15 13:00:00', 3, 'KCK 123K', 50.00, 150.00, 'BK20260215001', 'cancelled', '2026-02-15 09:45:00', '2026-02-15 09:45:00');

-- ============================================================================
-- PAYMENTS
-- ============================================================================
INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, mpesa_receipt, created_at, updated_at) VALUES
-- Completed payments
(1, 100.00, 'mpesa', 'completed', 'MPESA001', 'QAS123ABC', '2026-02-10 07:50:00', '2026-02-10 07:50:00'),
(2, 150.00, 'mpesa', 'completed', 'MPESA002', 'QAS124DEF', '2026-02-11 09:00:00', '2026-02-11 09:00:00'),
(3, 200.00, 'mpesa', 'completed', 'MPESA003', 'QAS125GHI', '2026-02-12 10:10:00', '2026-02-12 10:10:00'),
(4, 100.00, 'card', 'completed', 'CARD001', NULL, '2026-02-13 11:05:00', '2026-02-13 11:05:00'),
(5, 150.00, 'mpesa', 'completed', 'MPESA004', 'QAS126JKL', '2026-02-14 08:25:00', '2026-02-14 08:25:00'),

-- Active bookings - paid
(6, 200.00, 'mpesa', 'completed', 'MPESA005', 'QAS127MNO', '2026-02-24 08:00:00', '2026-02-24 08:00:00'),
(7, 100.00, 'mpesa', 'completed', 'MPESA006', 'QAS128PQR', '2026-02-24 09:05:00', '2026-02-24 09:05:00'),
(8, 250.00, 'card', 'completed', 'CARD002', NULL, '2026-02-24 10:00:00', '2026-02-24 10:00:00'),
(9, 150.00, 'mpesa', 'completed', 'MPESA007', 'QAS129STU', '2026-02-24 07:05:00', '2026-02-24 07:05:00'),
(10, 150.00, 'mpesa', 'completed', 'MPESA008', 'QAS130VWX', '2026-02-24 11:00:00', '2026-02-24 11:00:00'),

-- Reserved bookings - pending payment
(11, 200.00, 'mpesa', 'pending', NULL, NULL, '2026-02-24 15:05:00', '2026-02-24 15:05:00'),
(12, 150.00, 'mpesa', 'pending', NULL, NULL, '2026-02-24 16:05:00', '2026-02-24 16:05:00'),
(13, 100.00, 'mpesa', 'pending', NULL, NULL, '2026-02-24 17:05:00', '2026-02-24 17:05:00'),

-- Cancelled booking - refunded
(14, 150.00, 'mpesa', 'refunded', 'MPESA009', 'QAS131YZA', '2026-02-15 09:50:00', '2026-02-15 09:50:00');

-- ============================================================================
-- REVIEWS
-- ============================================================================
INSERT INTO reviews (user_id, parking_lot_id, rating, comment, manager_response, responded_at, created_at, updated_at) VALUES
(9, 1, 5, 'Excellent parking facility! Well maintained and secure. Staff are very helpful.', 'Thank you for your kind words! We appreciate your feedback.', '2026-02-11 10:00:00', '2026-02-10 18:00:00', '2026-02-10 18:00:00'),
(10, 1, 4, 'Good parking lot. Sometimes crowded but overall good experience.', NULL, NULL, '2026-02-12 19:00:00', '2026-02-12 19:00:00'),
(11, 1, 5, 'Love the covered parking and EV charging stations. Very convenient!', 'Thank you! We are glad you enjoyed the amenities.', '2026-02-14 09:00:00', '2026-02-13 20:00:00', '2026-02-13 20:00:00'),
(12, 2, 4, 'Close to the library which is great. Could use better lighting at night.', 'Thank you for the feedback. We will work on improving the lighting.', '2026-02-15 10:00:00', '2026-02-14 17:00:00', '2026-02-14 17:00:00'),
(13, 2, 5, 'Perfect location for library visits. Always find parking here.', NULL, NULL, '2026-02-15 18:00:00', '2026-02-15 18:00:00'),
(14, 3, 3, 'Parking is fine but a bit expensive for the mall.', NULL, NULL, '2026-02-16 20:00:00', '2026-02-16 20:00:00'),
(15, 3, 4, 'Good parking structure. EV charging is a plus!', NULL, NULL, '2026-02-17 19:00:00', '2026-02-17 19:00:00');

-- ============================================================================
-- AUDIT LOGS
-- ============================================================================
INSERT INTO audit_logs (user_id, action, entity_type, entity_id, details, ip_address, created_at) VALUES
(1, 'user_created', 'user', 9, '{"role": "driver", "email": "driver@demo.com"}', '192.168.1.1', '2024-03-01 08:00:00'),
(4, 'parking_lot_created', 'parking_lot', 1, '{"name": "Main Campus Parking", "capacity": 80}', '192.168.1.2', '2024-02-15 08:00:00'),
(4, 'parking_lot_created', 'parking_lot', 2, '{"name": "Library Parking Lot", "capacity": 48}', '192.168.1.2', '2024-02-20 09:00:00'),
(9, 'booking_created', 'booking', 1, '{"slot": "A02", "amount": 100.00}', '192.168.1.10', '2026-02-10 07:45:00'),
(9, 'payment_completed', 'payment', 1, '{"amount": 100.00, "method": "mpesa"}', '192.168.1.10', '2026-02-10 07:50:00'),
(1, 'user_banned', 'user', 20, '{"reason": "Policy violation"}', '192.168.1.1', '2024-04-26 10:00:00'),
(4, 'slot_status_updated', 'parking_slot', 20, '{"old_status": "available", "new_status": "maintenance"}', '192.168.1.2', '2026-02-20 08:00:00');

-- ============================================================================
-- SYSTEM SETTINGS
-- ============================================================================
INSERT INTO system_settings (setting_key, setting_value, description, updated_at) VALUES
('platform_name', 'ParkHub', 'Platform name', NOW()),
('default_hourly_rate', '50', 'Default hourly parking rate (KES)', NOW()),
('commission_rate', '10', 'Platform commission rate (%)', NOW()),
('mpesa_paybill', '123456', 'M-Pesa paybill number', NOW()),
('support_email', 'support@parkhub.com', 'Support email address', NOW()),
('min_booking_hours', '1', 'Minimum booking duration (hours)', NOW()),
('max_booking_hours', '24', 'Maximum booking duration (hours)', NOW());
