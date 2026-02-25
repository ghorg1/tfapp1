import pool from '../config/db';
import { TaskHistory, AuditAction } from '../types';

export async function recordHistory(
  taskId: number,
  userId: number,
  action: AuditAction,
  changes: Record<string, unknown> = {}
): Promise<TaskHistory> {
  const result = await pool.query(
    'INSERT INTO task_history (task_id, user_id, action, changes) VALUES ($1, $2, $3, $4) RETURNING *',
    [taskId, userId, action, JSON.stringify(changes)]
  );
  return result.rows[0];
}

export async function getHistoryByTask(taskId: number): Promise<TaskHistory[]> {
  const result = await pool.query(
    'SELECT * FROM task_history WHERE task_id = $1 ORDER BY created_at ASC',
    [taskId]
  );
  return result.rows;
}
