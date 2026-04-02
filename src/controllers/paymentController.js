const paymentModel = require('../models/paymentModel');
const orderModel = require('../models/orderModel');
const { PAYMENT_STATUS, ORDER_STATUS, ROLES } = require('../utils/constants');

async function ensureOrderAccess(req, orderId) {
  const order = await orderModel.getOrderById(orderId);
  if (!order) {
    return { error: { status: 404, message: 'Order not found' } };
  }

  const isCustomerOnly = req.user.roles.includes(ROLES.CUSTOMER)
    && !req.user.roles.includes(ROLES.ADMIN)
    && !req.user.roles.includes(ROLES.ACCOUNTANT)
    && !req.user.roles.includes(ROLES.MANAGER);

  if (isCustomerOnly && order.customer_id !== req.user.id) {
    return { error: { status: 403, message: 'Forbidden: You can access only your own orders' } };
  }

  return { order };
}

async function createPayment(req, res) {
  try {
    const { order_id, amount, payment_method, type } = req.body;
    await paymentModel.addPayment({ order_id, amount, payment_method, type });

    const summary = await paymentModel.getOrderPaymentSummary(order_id);
    if (!summary) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const paid = Number(summary.paid_amount);
    const total = Number(summary.total_amount);

    if (paid >= total) {
      await orderModel.updateOrderStatus(order_id, ORDER_STATUS.CONFIRMED);
      return res.json({ message: 'Payment completed', payment_status: PAYMENT_STATUS.PAID });
    }

    return res.json({ message: 'Advance payment received', payment_status: PAYMENT_STATUS.PARTIAL });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function getOrderPaymentSummary(req, res) {
  try {
    const orderId = Number(req.params.orderId);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const access = await ensureOrderAccess(req, orderId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }

    const summary = await paymentModel.getOrderPaymentSummary(orderId);
    if (!summary) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const total = Number(summary.total_amount);
    const paid = Number(summary.paid_amount);

    return res.json({
      ...summary,
      remaining_amount: Math.max(0, total - paid),
      payment_status: paid >= total ? PAYMENT_STATUS.PAID : paid > 0 ? PAYMENT_STATUS.PARTIAL : PAYMENT_STATUS.PENDING
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function simulateOnlinePayment(req, res) {
  try {
    const orderId = Number(req.params.orderId);
    if (!Number.isInteger(orderId) || orderId <= 0) {
      return res.status(400).json({ message: 'Invalid order id' });
    }

    const access = await ensureOrderAccess(req, orderId);
    if (access.error) {
      return res.status(access.error.status).json({ message: access.error.message });
    }

    const orderSummary = await paymentModel.getOrderPaymentSummary(orderId);
    if (!orderSummary) {
      return res.status(404).json({ message: 'Order not found' });
    }

    const remaining = Number(orderSummary.total_amount) - Number(orderSummary.paid_amount);
    if (remaining <= 0) {
      return res.json({ message: 'Order already fully paid' });
    }

    await paymentModel.addPayment({
      order_id: orderId,
      amount: remaining,
      payment_method: 'ONLINE_MOCK_GATEWAY',
      type: 'remaining'
    });

    await orderModel.updateOrderStatus(orderId, ORDER_STATUS.CONFIRMED);

    return res.json({ message: 'Mock online payment successful', paid_amount: remaining, status: PAYMENT_STATUS.PAID });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function paymentReport(req, res) {
  try {
    const period = req.query.period === 'monthly' ? 'monthly' : 'daily';
    const report = await paymentModel.getPaymentReport(period);
    return res.json(report);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { createPayment, getOrderPaymentSummary, simulateOnlinePayment, paymentReport };
