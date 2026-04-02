const express = require('express');
const { body } = require('express-validator');
const paymentController = require('../controllers/paymentController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validationMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.ACCOUNTANT, ROLES.ADMIN),
  [
    body('order_id').isInt({ min: 1 }),
    body('amount').isFloat({ min: 0.01 }),
    body('payment_method').notEmpty(),
    body('type').isIn(['advance', 'remaining'])
  ],
  handleValidation,
  paymentController.createPayment
);

router.get('/:orderId/summary', authorize(ROLES.CUSTOMER, ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.MANAGER), paymentController.getOrderPaymentSummary);
router.post('/mock/:orderId', authorize(ROLES.CUSTOMER, ROLES.ACCOUNTANT, ROLES.ADMIN), paymentController.simulateOnlinePayment);
router.get('/report', authorize(ROLES.ACCOUNTANT, ROLES.ADMIN, ROLES.MANAGER), paymentController.paymentReport);

module.exports = router;
