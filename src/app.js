const express = require('express');
const pool = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');
const errorHandler = require('./middleware/errorHandler');

const app = express();
app.use(express.json());

async function init() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name TEXT NOT NULL
    );
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id SERIAL PRIMARY KEY,
      title TEXT NOT NULL,
      user_id INTEGER REFERENCES users(id)
    );
  `);
}

let initialized = false;

async function ensureInit() {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

app.use(async (req, res, next) => {
  await ensureInit();
  next();
});


app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use(errorHandler);

module.exports = app;
