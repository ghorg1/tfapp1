import pool from '../config/db';

export interface User {
  id: number;
  name: string;
}

export async function createUser(name: string): Promise<User> {
  const result = await pool.query(
    'INSERT INTO users (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

export async function getAllUsers(): Promise<User[]> {
  const result = await pool.query('SELECT * FROM users');
  return result.rows;
}
