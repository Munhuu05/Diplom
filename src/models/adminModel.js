const pool = require('../config/db');

async function listConcreteGrades() {
  const [rows] = await pool.query('SELECT * FROM concrete_grades ORDER BY id DESC');
  return rows;
}

async function createConcreteGrade({ grade_code, description }) {
  const [result] = await pool.query(
    'INSERT INTO concrete_grades (grade_code, description) VALUES (?, ?)',
    [grade_code, description || null]
  );
  return result.insertId;
}

async function listTariffs() {
  const [rows] = await pool.query(
    `SELECT pt.*, cg.grade_code
     FROM price_tariffs pt
     JOIN concrete_grades cg ON cg.id = pt.concrete_grade_id
     ORDER BY pt.id DESC`
  );
  return rows;
}

async function createTariff({ concrete_grade_id, price_per_m3, pump_cost, delivery_cost }) {
  const [result] = await pool.query(
    'INSERT INTO price_tariffs (concrete_grade_id, price_per_m3, pump_cost, delivery_cost, is_active) VALUES (?, ?, ?, ?, 1)',
    [concrete_grade_id, price_per_m3, pump_cost, delivery_cost]
  );
  return result.insertId;
}

module.exports = { listConcreteGrades, createConcreteGrade, listTariffs, createTariff };
