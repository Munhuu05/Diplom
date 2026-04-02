const userModel = require('../models/userModel');
const adminModel = require('../models/adminModel');

async function listUsers(req, res) {
  try {
    const users = await userModel.listUsers();
    return res.json(users);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
    await userModel.deleteUser(Number(req.params.id));
    return res.json({ message: 'User deleted' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

async function assignRole(req, res) {
  try {
    const { roleName } = req.body;
    await userModel.assignRole(Number(req.params.id), roleName);
    return res.json({ message: 'Role assigned' });
  } catch (error) {
    return res.status(400).json({ message: error.message });
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
  updateUser,
  deleteUser,
  assignRole,
  listConcreteGrades,
  createConcreteGrade,
  listTariffs,
  createTariff
};
