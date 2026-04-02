const express = require('express');
const { body } = require('express-validator');
const orderController = require('../controllers/orderController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validationMiddleware');
const { ROLES, ORDER_STATUS } = require('../utils/constants');

const router = express.Router();

router.use(authenticate);

router.post(
  '/',
  authorize(ROLES.CUSTOMER),
  [
    body('concrete_grade_id').isInt({ min: 1 }),
    body('volume_m3').isFloat({ min: 0.5 }),
    body('delivery_datetime').isISO8601(),
    body('delivery_address').notEmpty(),
    body('pump_required').isBoolean()
  ],
  handleValidation,
  orderController.createOrder
);

router.get('/my', authorize(ROLES.CUSTOMER), orderController.getMyOrders);
router.patch('/my/:id/cancel', authorize(ROLES.CUSTOMER), orderController.cancelOrder);

router.get('/all', authorize(ROLES.MANAGER, ROLES.ADMIN), orderController.getAllOrders);
router.patch(
  '/:id/status',
  authorize(ROLES.MANAGER, ROLES.ADMIN),
  [body('status').isIn(Object.values(ORDER_STATUS))],
  handleValidation,
  orderController.updateOrderStatus
);

router.get('/production/confirmed', authorize(ROLES.PRODUCTION_ENGINEER), orderController.getConfirmedOrders);
router.patch('/production/:id/in-production', authorize(ROLES.PRODUCTION_ENGINEER), orderController.markInProduction);
router.patch('/production/:id/produced', authorize(ROLES.PRODUCTION_ENGINEER), orderController.markProduced);

router.get('/deliveries/my', authorize(ROLES.DRIVER), orderController.getDriverDeliveries);
router.patch('/deliveries/:id/status', authorize(ROLES.DRIVER), orderController.updateDeliveryStatus);

module.exports = router;
