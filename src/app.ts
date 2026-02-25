import express, { Request, Response, NextFunction } from 'express';
import pool from './config/db';
import userRoutes from './routes/userRoutes';
import taskRoutes from './routes/taskRoutes';
import errorHandler from './middleware/errorHandler';

const app = express();
app.use(express.json());

async function init(): Promise<void> {
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

async function ensureInit(): Promise<void> {
  if (!initialized) {
    await init();
    initialized = true;
  }
}

app.use(async (req: Request, res: Response, next: NextFunction) => {
  await ensureInit();
  next();
});

app.use('/users', userRoutes);
app.use('/tasks', taskRoutes);
app.use(errorHandler);

export default app;
