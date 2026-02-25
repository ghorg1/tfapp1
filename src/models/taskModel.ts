import pool from '../config/db';

export interface Task {
  id: number;
  title: string;
  user_id: number;
}

export async function createTask(title: string, userId: number): Promise<Task> {
  const result = await pool.query(
    'INSERT INTO tasks (title, user_id) VALUES ($1, $2) RETURNING *',
    [title, userId]
  );
  return result.rows[0];
}

export async function getTasks(): Promise<Task[]> {
  const result = await pool.query('SELECT * FROM tasks');
  return result.rows;
}
