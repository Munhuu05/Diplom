const bcrypt = require('bcrypt');
const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');
const pool = require('../config/db');
const { ROLES } = require('../utils/constants');

async function ensureCustomerProfile(userId, fullName = 'Customer') {
  const [rows] = await pool.query('SELECT id FROM customers WHERE user_id = ?', [userId]);
  if (!rows.length) {
    await pool.query('INSERT INTO customers (user_id, company_name) VALUES (?, ?)', [userId, `${fullName} Company`]);
  }
}

async function listUsers(req, res) {
  try {
    const users = await userModel.listUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createUser(req, res) {
  try {
    const { full_name, email, phone, password, roleName } = req.body;

    const existing = await userModel.findUserByEmail(email);
    if (existing) {
      return res.status(409).json({ message: 'Email already exists' });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const userId = await userModel.createUser({ full_name, email, phone, password_hash });
    await userModel.assignRole(userId, roleName);

    if (roleName === ROLES.CUSTOMER) {
      await ensureCustomerProfile(userId, full_name);
    }

    return res.status(201).json({ message: 'User created', userId });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function updateUser(req, res) {
  try {
    await userModel.updateUser(Number(req.params.id), req.body);
    return res.json({ message: 'User updated' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function deleteUser(req, res) {
  try {
    const targetUserId = Number(req.params.id);
    if (targetUserId === req.user.id) {
      return res.status(400).json({ message: 'You cannot delete your own account' });
    }

    await userModel.deleteUser(targetUserId);
    return res.json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function assignRole(req, res) {
  try {
    const { roleName } = req.body;
    const userId = Number(req.params.id);
    await userModel.assignRole(userId, roleName);

    if (roleName === ROLES.CUSTOMER) {
      const targetUser = await userModel.findUserById(userId);
      await ensureCustomerProfile(userId, targetUser ? targetUser.full_name : 'Customer');
    }

    return res.json({ message: 'Role assigned' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function listRoles(req, res) {
  try {
    const roles = await userModel.listRoles();
    return res.json(roles);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function listConcreteGrades(req, res) {
  try {
    const grades = await adminModel.listConcreteGrades();
    return res.json(grades);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createConcreteGrade(req, res) {
  try {
    const id = await adminModel.createConcreteGrade(req.body);
    return res.status(201).json({ message: 'Concrete grade created', id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

async function listTariffs(req, res) {
  try {
    const tariffs = await adminModel.listTariffs();
    return res.json(tariffs);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function createTariff(req, res) {
  try {
    const id = await adminModel.createTariff(req.body);
    return res.status(201).json({ message: 'Tariff created', id });
  } catch (error) {
    return res.status(400).json({ message: error.message });
  }
}

module.exports = {
  listUsers,
  createUser,
  updateUser,
  deleteUser,
  assignRole,
  listRoles,
  listConcreteGrades,
  createConcreteGrade,
  listTariffs,
  createTariff
};
