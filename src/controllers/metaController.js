const adminModel = require('../models/adminModel');

async function getConcreteGrades(req, res) {
  try {
    const rows = await adminModel.listConcreteGrades();
    return res.json(rows);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

module.exports = { getConcreteGrades };
