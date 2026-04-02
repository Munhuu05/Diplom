const pool = require('../config/db');

async function createOrder(data) {
  const [tariffRows] = await pool.query(
    'SELECT * FROM price_tariffs WHERE concrete_grade_id = ? AND is_active = 1 ORDER BY created_at DESC LIMIT 1',
    [data.concrete_grade_id]
  );

  if (!tariffRows.length) {
    throw new Error('No active tariff for selected grade');
  }

  const tariff = tariffRows[0];
  const subtotal = data.volume_m3 * Number(tariff.price_per_m3);
  const pumpCharge = data.pump_required ? Number(tariff.pump_cost) : 0;
  const totalAmount = subtotal + pumpCharge + Number(tariff.delivery_cost);

  const [result] = await pool.query(
    `INSERT INTO orders
    (customer_id, concrete_grade_id, volume_m3, delivery_datetime, delivery_address, pump_required, status, total_amount)
    VALUES (?, ?, ?, ?, ?, ?, 'NEW', ?)`,
    [
      data.customer_id,
      data.concrete_grade_id,
      data.volume_m3,
      data.delivery_datetime,
      data.delivery_address,
      Number(data.pump_required),
      totalAmount
    ]
  );

  return { orderId: result.insertId, totalAmount };
}

async function getCustomerOrders(customerId) {
  const [rows] = await pool.query(
    `SELECT o.*, cg.grade_code
     FROM orders o
     JOIN concrete_grades cg ON cg.id = o.concrete_grade_id
     WHERE o.customer_id = ?
     ORDER BY o.id DESC`,
    [customerId]
  );
  return rows;
}

async function getAllOrders() {
  const [rows] = await pool.query(
    `SELECT o.*, u.full_name AS customer_name, cg.grade_code
     FROM orders o
     JOIN users u ON u.id = o.customer_id
     JOIN concrete_grades cg ON cg.id = o.concrete_grade_id
     ORDER BY o.id DESC`
  );
  return rows;
}

async function updateOrderStatus(orderId, status) {
  await pool.query('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, orderId]);
}

async function getOrderById(orderId) {
  const [rows] = await pool.query('SELECT * FROM orders WHERE id = ?', [orderId]);
  return rows[0];
}

async function cancelOrder(orderId, customerId) {
  await pool.query(
    "UPDATE orders SET status = 'CANCELLED', updated_at = CURRENT_TIMESTAMP WHERE id = ? AND customer_id = ? AND status = 'NEW'",
    [orderId, customerId]
  );
}

async function assignDelivery(orderId, driverId) {
  await pool.query(
    `INSERT INTO deliveries (order_id, driver_id, status)
     VALUES (?, ?, 'OUT_FOR_DELIVERY')
     ON DUPLICATE KEY UPDATE driver_id = VALUES(driver_id), status='OUT_FOR_DELIVERY', updated_at = CURRENT_TIMESTAMP`,
    [orderId, driverId]
  );
}

async function getDriverDeliveries(driverId) {
  const [rows] = await pool.query(
    `SELECT d.*, o.delivery_address, o.delivery_datetime
     FROM deliveries d
     JOIN orders o ON o.id = d.order_id
     WHERE d.driver_id = ?
     ORDER BY d.id DESC`,
    [driverId]
  );
  return rows;
}

async function updateDeliveryStatus(deliveryId, status) {
  await pool.query('UPDATE deliveries SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', [status, deliveryId]);
}

module.exports = {
  createOrder,
  getCustomerOrders,
  getAllOrders,
  updateOrderStatus,
  getOrderById,
  cancelOrder,
  assignDelivery,
  getDriverDeliveries,
  updateDeliveryStatus
};
