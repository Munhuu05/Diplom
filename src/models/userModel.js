const pool = require('../config/db');

async function createUser({ full_name, email, phone, password_hash }) {
  const [result] = await pool.query(
    'INSERT INTO users (full_name, email, phone, password_hash) VALUES (?, ?, ?, ?)',
    [full_name, email, phone || null, password_hash]
  );
  return result.insertId;
}

async function findUserByEmail(email) {
  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email]);
  return rows[0];
}

async function findUserById(id) {
  const [rows] = await pool.query('SELECT id, full_name, email, phone, is_active, created_at FROM users WHERE id = ?', [id]);
  return rows[0];
}

async function listUsers() {
  const [rows] = await pool.query('SELECT id, full_name, email, phone, is_active, created_at FROM users ORDER BY id DESC');
  return rows;
}

async function updateUser(id, { full_name, phone, is_active }) {
  await pool.query(
    'UPDATE users SET full_name = COALESCE(?, full_name), phone = COALESCE(?, phone), is_active = COALESCE(?, is_active) WHERE id = ?',
    [full_name || null, phone || null, typeof is_active === 'boolean' ? Number(is_active) : null, id]
  );
}

async function deleteUser(id) {
  await pool.query('DELETE FROM users WHERE id = ?', [id]);
}

async function getUserRoles(userId) {
  const [rows] = await pool.query(
    `SELECT r.name
     FROM user_roles ur
     JOIN roles r ON r.id = ur.role_id
     WHERE ur.user_id = ?`,
    [userId]
  );
  return rows.map((r) => r.name);
}

async function assignRole(userId, roleName) {
  const [roleRows] = await pool.query('SELECT id FROM roles WHERE name = ?', [roleName]);
  if (!roleRows.length) {
    throw new Error('Role does not exist');
  }

  const roleId = roleRows[0].id;
  await pool.query('INSERT IGNORE INTO user_roles (user_id, role_id) VALUES (?, ?)', [userId, roleId]);
}

module.exports = {
  createUser,
  findUserByEmail,
  findUserById,
  listUsers,
  updateUser,
  deleteUser,
  getUserRoles,
  assignRole
};
