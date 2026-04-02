const express = require('express');
const { body } = require('express-validator');
const authController = require('../controllers/authController');
const { handleValidation } = require('../middleware/validationMiddleware');

const router = express.Router();

router.post(
  '/register',
  [
    body('full_name').trim().notEmpty().withMessage('Full name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 chars')
  ],
  handleValidation,
  authController.register
);

router.post(
  '/login',
  [body('email').isEmail(), body('password').notEmpty()],
  handleValidation,
  authController.login
);

module.exports = router;
