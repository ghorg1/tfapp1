import pool from '../config/db';
import { Comment } from '../types';

export async function createComment(taskId: number, userId: number, body: string): Promise<Comment> {
  const result = await pool.query(
    'INSERT INTO comments (task_id, user_id, body) VALUES ($1, $2, $3) RETURNING *',
    [taskId, userId, body]
  );
  return result.rows[0];
}

export async function getCommentsByTask(taskId: number): Promise<Comment[]> {
  const result = await pool.query(
    'SELECT * FROM comments WHERE task_id = $1 ORDER BY created_at ASC',
    [taskId]
  );
  return result.rows;
}

export async function findById(id: number): Promise<Comment | null> {
  const result = await pool.query('SELECT * FROM comments WHERE id = $1', [id]);
  return result.rows[0] || null;
}
