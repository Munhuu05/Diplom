const pool = require('../config/db');

async function addPayment({ order_id, amount, payment_method, type }) {
  const [result] = await pool.query(
    'INSERT INTO payments (order_id, amount, payment_method, type, payment_date) VALUES (?, ?, ?, ?, NOW())',
    [order_id, amount, payment_method, type]
  );
  return result.insertId;
}

async function getOrderPaymentSummary(orderId) {
  const [rows] = await pool.query(
    `SELECT
      o.id AS order_id,
      o.total_amount,
      COALESCE(SUM(p.amount), 0) AS paid_amount
     FROM orders o
     LEFT JOIN payments p ON p.order_id = o.id
     WHERE o.id = ?
     GROUP BY o.id, o.total_amount`,
    [orderId]
  );
  return rows[0];
}

async function getPaymentReport(period = 'daily') {
  const groupExpr = period === 'monthly' ? "DATE_FORMAT(payment_date, '%Y-%m')" : 'DATE(payment_date)';
  const [rows] = await pool.query(
    `SELECT ${groupExpr} AS period, COUNT(*) AS total_transactions, SUM(amount) AS total_amount
     FROM payments
     GROUP BY period
     ORDER BY period DESC`
  );
  return rows;
}

module.exports = { addPayment, getOrderPaymentSummary, getPaymentReport };
