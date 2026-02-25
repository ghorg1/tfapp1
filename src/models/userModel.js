const pool = require('../config/db');

async function createUser(name) {
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

async function getAllUsers() {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}

module.exports = { createUser, getAllUsers };
