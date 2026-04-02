# Concrete Order Management System

Production-ready starter implementation with role-based modules for concrete order lifecycle, payment, delivery, and reporting.

## 1) Folder Structure

```text
Diplom/
├── package.json
├── .env.example
├── README.md
├── sql/
│   ├── schema.sql
│   └── seed.sql
├── src/
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── adminController.js
│   │   ├── authController.js
│   │   ├── orderController.js
│   │   ├── paymentController.js
│   │   └── reportController.js
│   ├── middleware/
│   │   ├── authMiddleware.js
│   │   └── validationMiddleware.js
│   ├── models/
│   │   ├── adminModel.js
│   │   ├── orderModel.js
│   │   ├── paymentModel.js
│   │   └── userModel.js
│   ├── routes/
│   │   ├── adminRoutes.js
│   │   ├── authRoutes.js
│   │   ├── orderRoutes.js
│   │   ├── paymentRoutes.js
│   │   └── reportRoutes.js
│   └── utils/
│       └── constants.js
└── public/
    ├── css/styles.css
    ├── js/app.js
    ├── admin.html
    ├── create-order.html
    ├── dashboard.html
    ├── login.html
    ├── orders.html
    └── register.html
```

## 2) Key Features Implemented

- JWT-based authentication (`register`, `login`) with bcrypt hashing.
- Role-based authorization for Admin, Manager, Customer, Production Engineer, Driver, Accountant.
- Full order lifecycle states and delivery sub-states.
- Admin CRUD-style operations for users, role assignment, concrete grades, and tariffs.
- Customer order placement/history/cancel.
- Manager order review and status update.
- Production endpoints for confirmed orders and production marking.
- Driver delivery assignment and status updates.
- Accountant payment management + mock online payment endpoint.
- Daily/monthly reporting endpoints.
- Input validation (`express-validator`) and centralized request validation middleware.
- MySQL connection pooling via `mysql2/promise`.

## 3) MySQL Database Schema

Use `sql/schema.sql` for complete `CREATE TABLE` DDL with:
- Primary keys
- Foreign keys
- Indexes

## 4) How to Run (Step-by-step)

```bash
# 1) Enter project
cd /workspace/Diplom

# 2) Install dependencies
npm install

# 3) Create environment file
cp .env.example .env
# Edit .env with your MySQL credentials

# 4) Create DB schema
mysql -u root -p < sql/schema.sql

# 5) Load sample data
mysql -u root -p < sql/seed.sql

# 6) Run in development
npm run dev

# 7) Open frontend
# http://localhost:5000/login.html
```

## 5) Example Test Data

Seed users (`password123` for all):
- admin@concrete.local (ADMIN)
- manager@concrete.local (MANAGER)
- engineer@concrete.local (PRODUCTION_ENGINEER)
- driver@concrete.local (DRIVER)
- accountant@concrete.local (ACCOUNTANT)
- customer@concrete.local (CUSTOMER)

Concrete grades seeded:
- M200
- M300

Sample API calls:

```bash
# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@concrete.local","password":"password123"}'

# Customer create order (replace TOKEN)
curl -X POST http://localhost:5000/api/orders \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "concrete_grade_id":1,
    "volume_m3":12,
    "delivery_datetime":"2026-04-15T08:00:00.000Z",
    "delivery_address":"10 Industrial Rd, Boston, MA",
    "pump_required":true
  }'

# Manager update order status
curl -X PATCH http://localhost:5000/api/orders/1/status \
  -H "Authorization: Bearer TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":"CONFIRMED"}'
```

## Notes

- This is a complete baseline and can be extended with advanced UI workflows, audit logging, notifications, and invoice generation.
- For production deployment, add HTTPS, secure secret rotation, rate limiting, and automated tests/CI.
