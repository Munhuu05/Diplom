const pool = require('../config/db');
const orderModel = require('../models/orderModel');
const { ORDER_STATUS } = require('../utils/constants');

async function createOrder(req, res) {
  try {
    const data = {
      customer_id: req.user.id,
      concrete_grade_id: Number(req.body.concrete_grade_id),
      volume_m3: Number(req.body.volume_m3),
      delivery_datetime: req.body.delivery_datetime,
      delivery_address: req.body.delivery_address,
      pump_required: Boolean(req.body.pump_required)
    };

    const result = await orderModel.createOrder(data);
    return res.status(201).json({ message: 'Order created', ...result });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getMyOrders(req, res) {
  try {
    const orders = await orderModel.getCustomerOrders(req.user.id);
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function cancelOrder(req, res) {
  try {
    await orderModel.cancelOrder(Number(req.params.id), req.user.id);
    return res.json({ message: 'Order cancelled if eligible' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getAllOrders(req, res) {
  try {
    const orders = await orderModel.getAllOrders();
    return res.json(orders);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateOrderStatus(req, res) {
  try {
    const { status } = req.body;
    const orderId = Number(req.params.id);
    await orderModel.updateOrderStatus(orderId, status);

    if (status === ORDER_STATUS.OUT_FOR_DELIVERY && req.body.driver_id) {
      await orderModel.assignDelivery(orderId, Number(req.body.driver_id));
    }

    return res.json({ message: 'Order status updated' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function getConfirmedOrders(req, res) {
  try {
    const [rows] = await pool.query("SELECT * FROM orders WHERE status = 'CONFIRMED' ORDER BY id DESC");
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function markInProduction(req, res) {
  try {
    await orderModel.updateOrderStatus(Number(req.params.id), ORDER_STATUS.IN_PRODUCTION);
    return res.json({ message: 'Order marked IN_PRODUCTION' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function markProduced(req, res) {
  try {
    await orderModel.updateOrderStatus(Number(req.params.id), ORDER_STATUS.PRODUCED);
    return res.json({ message: 'Order marked PRODUCED' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getDriverDeliveries(req, res) {
  try {
    const rows = await orderModel.getDriverDeliveries(req.user.id);
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function updateDeliveryStatus(req, res) {
  try {
    const { status } = req.body;
    await orderModel.updateDeliveryStatus(Number(req.params.id), status);
    return res.json({ message: 'Delivery updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = {
  createOrder,
  getMyOrders,
  cancelOrder,
  getAllOrders,
  updateOrderStatus,
  getConfirmedOrders,
  markInProduction,
  markProduced,
  getDriverDeliveries,
  updateDeliveryStatus
};
