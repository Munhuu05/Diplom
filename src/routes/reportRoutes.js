const express = require('express');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const reportController = require('../controllers/reportController');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.get(
  '/dashboard',
  authenticate,
  authorize(ROLES.ADMIN, ROLES.MANAGER, ROLES.ACCOUNTANT),
  reportController.dashboardReport
);

module.exports = router;
