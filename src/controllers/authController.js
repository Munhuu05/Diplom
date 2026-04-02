const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const userModel = require('../models/userModel');
const pool = require('../config/db');
const { ROLES } = require('../utils/constants');

function signToken(user, roles) {
  return jwt.sign({ id: user.id, email: user.email, roles }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d'
  });
}

async function register(req, res) {
  try {
    const { full_name, email, phone, password } = req.body;
    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({ full_name, email, phone, password_hash });

    await userModel.assignRole(userId, ROLES.CUSTOMER);

    const [customerInsert] = await pool.query('INSERT INTO customers (user_id, company_name) VALUES (?, ?)', [
      userId,
      `${full_name} Company`
    ]);

    return res.status(201).json({ message: 'Registered successfully', userId, customerId: customerInsert.insertId });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function login(req, res) {
  try {
    const { email, password } = req.body;
    const user = await userModel.findUserByEmail(email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const roles = await userModel.getUserRoles(user.id);
    const token = signToken(user, roles);

    return res.json({ token, user: { id: user.id, full_name: user.full_name, email: user.email, roles } });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { register, login };
