const pool = require('../config/db');

async function createTask(title, userId) {
  const result = await pool.query(
    'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, userId]
  );
  return result.rows[0];
}

async function getTasks() {
  const result = await pool.query(
    'SELECT * FROM tasks'
  );
  return result.rows;
}

module.exports = { createTask, getTasks };
