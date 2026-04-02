const express = require('express');
const { body } = require('express-validator');
const adminController = require('../controllers/adminController');
const { authenticate, authorize } = require('../middleware/authMiddleware');
const { handleValidation } = require('../middleware/validationMiddleware');
const { ROLES } = require('../utils/constants');

const router = express.Router();

router.use(authenticate, authorize(ROLES.ADMIN));

router.get('/roles', adminController.listRoles);
router.get('/users', adminController.listUsers);
router.post(
  '/users',
  [
    body('full_name').trim().notEmpty(),
    body('email').isEmail(),
    body('password').isLength({ min: 6 }),
    body('roleName').notEmpty()
  ],
  handleValidation,
  adminController.createUser
);
router.put('/users/:id', adminController.updateUser);
router.delete('/users/:id', adminController.deleteUser);
router.post('/users/:id/roles', [body('roleName').notEmpty()], handleValidation, adminController.assignRole);

router.get('/concrete-grades', adminController.listConcreteGrades);
router.post('/concrete-grades', [body('grade_code').notEmpty()], handleValidation, adminController.createConcreteGrade);

router.get('/tariffs', adminController.listTariffs);
router.post(
  '/tariffs',
  [
    body('concrete_grade_id').isInt({ min: 1 }),
    body('price_per_m3').isFloat({ min: 0 }),
    body('pump_cost').isFloat({ min: 0 }),
    body('delivery_cost').isFloat({ min: 0 })
  ],
  handleValidation,
  adminController.createTariff
);

module.exports = router;
