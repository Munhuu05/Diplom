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
│   │   ├── metaController.js
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
│   │   ├── metaRoutes.js
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

## 2) Improved Features (UI + Workflow)

- Cleaner responsive UI for easier use by non-technical staff.
- Admin panel now supports:
  - Create users directly
  - Assign roles dynamically
  - View all users with current roles
- Customer flow improved:
  - Grade selector dropdown when creating order
  - Payment summary check and mock online payment from Orders page
- Manager/Admin flow improved:
  - Inline order status updates from Orders page
- Dashboard expanded:
  - Revenue + order summaries
  - Daily payment report section

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

## 6) Main API Endpoints

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/meta/grades`
- `GET /api/orders/my`
- `GET /api/orders/all`
- `PATCH /api/orders/:id/status`
- `GET /api/payments/:orderId/summary`
- `POST /api/payments/mock/:orderId`
- `GET /api/reports/dashboard`
- `GET /api/admin/users`
- `POST /api/admin/users`
- `POST /api/admin/users/:id/roles`

## Notes

- This is a complete baseline and can be extended with audit logs, invoice PDFs, and notification channels.
- For production deployment, add HTTPS, rate limiting, and CI/CD test automation.
