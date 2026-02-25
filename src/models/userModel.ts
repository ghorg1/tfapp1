import pool from '../config/db';
import { User, SafeUser, UserRole } from '../types';

export async function createUser(
  name: string,
  email: string,
  passwordHash: string,
  role: UserRole = UserRole.USER
): Promise<User> {
  const result = await pool.query(
    'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING *',
    [name, email, passwordHash, role]
  );
  return result.rows[0];
}

export async function findByEmail(email: string): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0] || null;
}

export async function findById(id: number): Promise<User | null> {
  const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getAllUsers(): Promise<SafeUser[]> {
  const result = await pool.query(
    'SELECT id, name, email, active, role, created_at FROM users'
  );
  return result.rows;
}

export async function setActive(id: number, active: boolean): Promise<SafeUser | null> {
  const result = await pool.query(
    'UPDATE users SET active = $1 WHERE id = $2 RETURNING id, name, email, active, role, created_at',
    [active, id]
  );
  return result.rows[0] || null;
}
