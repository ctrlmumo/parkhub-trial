INSERT INTO users (username, email, password, is_admin, created_at) VALUES
('admin1', 'admin1@parking.com', 'hashed_pw1', TRUE, NOW()),
('admin2', 'admin2@parking.com', 'hashed_pw2', TRUE, NOW()),
('john_doe', 'john@example.com', 'hashed_pw3', FALSE, NOW()),
('jane_smith', 'jane@example.com', 'hashed_pw4', FALSE, NOW()),
('mike_lee', 'mike@example.com', 'hashed_pw5', FALSE, NOW()),
('susan_k', 'susan@example.com', 'hashed_pw6', FALSE, NOW()),
('kevin_b', 'kevin@example.com', 'hashed_pw7', FALSE, NOW()),
('lucy_m', 'lucy@example.com', 'hashed_pw8', FALSE, NOW()),
('peter_o', 'peter@example.com', 'hashed_pw9', FALSE, NOW()),
('anna_w', 'anna@example.com', 'hashed_pw10', FALSE, NOW());

INSERT INTO parking_lots (name, location, admin_id, created_at) VALUES
('Main Campus Lot', 'Main Building', 1, NOW()),
('Library Lot', 'Library Block', 1, NOW()),
('Staff Lot', 'Administration Wing', 2, NOW());

INSERT INTO parking_slots (parking_lot_id, slot_number, status, created_at) VALUES
-- Main Campus Lot
(1, 'A01', 'available', NOW()),
(1, 'A02', 'occupied', NOW()),
(1, 'A03', 'available', NOW()),
(1, 'A04', 'reserved', NOW()),
-- Library Lot
(2, 'B01', 'available', NOW()),
(2, 'B02', 'occupied', NOW()),
(2, 'B03', 'available', NOW()),
-- Staff Lot
(3, 'C01', 'available', NOW()),
(3, 'C02', 'reserved', NOW()),
(3, 'C03', 'occupied', NOW());

INSERT INTO reservations (user_id, parking_slot_id, start_time, end_time, status, created_at) VALUES
(3, 2, '2026-01-10 08:00:00', '2026-01-10 10:00:00', 'completed', NOW()),
(4, 4, '2026-01-10 09:00:00', '2026-01-10 11:00:00', 'active', NOW()),
(5, 6, '2026-01-11 07:00:00', '2026-01-11 09:00:00', 'active', NOW()),
(6, 9, '2026-01-11 10:00:00', '2026-01-11 12:00:00', 'cancelled', NOW()),
(7, 10,'2026-01-12 08:00:00', '2026-01-12 10:00:00', 'active', NOW()),
(8, 1, '2026-01-12 11:00:00', '2026-01-12 13:00:00', 'completed', NOW()),
(9, 3, '2026-01-13 09:00:00', '2026-01-13 11:00:00', 'active', NOW()),
(10,5, '2026-01-13 12:00:00', '2026-01-13 14:00:00', 'completed', NOW()),
(3, 7, '2026-01-14 08:00:00', '2026-01-14 10:00:00', 'active', NOW()),
(4, 8, '2026-01-14 11:00:00', '2026-01-14 13:00:00', 'cancelled', NOW());