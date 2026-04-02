USE concrete_management;

INSERT INTO roles (name) VALUES
('ADMIN'),
('MANAGER'),
('CUSTOMER'),
('PRODUCTION_ENGINEER'),
('DRIVER'),
('ACCOUNTANT');

-- password for all users below: password123
INSERT INTO users (full_name, email, phone, password_hash) VALUES
('System Admin', 'admin@concrete.local', '1000000001', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m'),
('Order Manager', 'manager@concrete.local', '1000000002', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m'),
('Production Eng', 'engineer@concrete.local', '1000000003', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m'),
('Driver One', 'driver@concrete.local', '1000000004', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m'),
('Accountant One', 'accountant@concrete.local', '1000000005', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m'),
('Customer One', 'customer@concrete.local', '1000000006', '$2b$10$Vh9.zXuHV4M4nJ7cpRb2fOz.s0r8f0.jOlrzONF8f6LoCT5xRcb6m');

INSERT INTO user_roles (user_id, role_id) VALUES
(1, 1),
(2, 2),
(3, 4),
(4, 5),
(5, 6),
(6, 3);

INSERT INTO customers (user_id, company_name, billing_address) VALUES
(6, 'Customer One LLC', '123 Main Street, NY');

INSERT INTO concrete_grades (grade_code, description) VALUES
('M200', 'Standard residential concrete'),
('M300', 'High-strength general purpose concrete');

INSERT INTO price_tariffs (concrete_grade_id, price_per_m3, pump_cost, delivery_cost, is_active) VALUES
(1, 85.00, 25.00, 15.00, 1),
(2, 110.00, 30.00, 20.00, 1);

INSERT INTO orders (customer_id, concrete_grade_id, volume_m3, delivery_datetime, delivery_address, pump_required, status, total_amount)
VALUES
(6, 1, 10.00, NOW() + INTERVAL 1 DAY, '123 Main Street, NY', 1, 'NEW', 890.00),
(6, 2, 7.00, NOW() + INTERVAL 2 DAY, '500 Sunset Ave, NJ', 0, 'CONFIRMED', 790.00);

INSERT INTO payments (order_id, amount, payment_method, type, payment_date) VALUES
(2, 300.00, 'BANK_TRANSFER', 'advance', NOW());
