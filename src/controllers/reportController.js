const pool = require('../config/db');

async function dashboardReport(req, res) {
  try {
    const [totals] = await pool.query(
      `SELECT COUNT(*) AS total_orders,
              COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       WHERE status <> 'CANCELLED'`
    );

    const [byStatus] = await pool.query(
      `SELECT status, COUNT(*) AS count
       FROM orders
       GROUP BY status
       ORDER BY count DESC`
    );

    const [daily] = await pool.query(
      `SELECT DATE(created_at) AS period, COUNT(*) AS total_orders, COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       GROUP BY DATE(created_at)
       ORDER BY period DESC
       LIMIT 30`
    );

    const [monthly] = await pool.query(
      `SELECT DATE_FORMAT(created_at, '%Y-%m') AS period, COUNT(*) AS total_orders, COALESCE(SUM(total_amount), 0) AS revenue
       FROM orders
       GROUP BY DATE_FORMAT(created_at, '%Y-%m')
       ORDER BY period DESC`
    );

    return res.json({ summary: totals[0], byStatus, daily, monthly });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { dashboardReport };
