import pool from '../config/db';
import { Task, TaskStatus } from '../types';

export async function createTask(
  title: string,
  userId: number,
  projectId?: number | null,
  assignedTo?: number | null,
  dueDate?: string | null
): Promise<Task> {
  const result = await pool.query(
    `INSERT INTO tasks (title, user_id, project_id, assigned_to, due_date)
     VALUES ($1, $2, $3, $4, $5) RETURNING *`,
    [title, userId, projectId || null, assignedTo || null, dueDate || null]
  );
  return result.rows[0];
}

export async function findById(id: number): Promise<Task | null> {
  const result = await pool.query(
    'SELECT * FROM tasks WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rows[0] || null;
}

export async function getTasks(filters?: {
  projectId?: number;
  status?: TaskStatus;
  assignedTo?: number;
  userId?: number;
}): Promise<Task[]> {
  const conditions: string[] = ['deleted_at IS NULL'];
  const params: unknown[] = [];
  let paramIndex = 1;

  if (filters?.projectId) {
    conditions.push(`project_id = $${paramIndex++}`);
    params.push(filters.projectId);
  }
  if (filters?.status) {
    conditions.push(`status = $${paramIndex++}`);
    params.push(filters.status);
  }
  if (filters?.assignedTo) {
    conditions.push(`assigned_to = $${paramIndex++}`);
    params.push(filters.assignedTo);
  }
  if (filters?.userId) {
    conditions.push(`user_id = $${paramIndex++}`);
    params.push(filters.userId);
  }

  const result = await pool.query(
    `SELECT * FROM tasks WHERE ${conditions.join(' AND ')} ORDER BY created_at DESC`,
    params
  );
  return result.rows;
}

export async function updateTask(
  id: number,
  fields: Partial<{ title: string; status: TaskStatus; assigned_to: number | null; due_date: string | null; project_id: number | null }>
): Promise<Task | null> {
  const setClauses: string[] = [];
  const params: unknown[] = [];
  let paramIndex = 1;

  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) {
      setClauses.push(`${key} = $${paramIndex++}`);
      params.push(value);
    }
  }

  if (setClauses.length === 0) return findById(id);

  params.push(id);
  const result = await pool.query(
    `UPDATE tasks SET ${setClauses.join(', ')} WHERE id = $${paramIndex} AND deleted_at IS NULL RETURNING *`,
    params
  );
  return result.rows[0] || null;
}

export async function softDelete(id: number): Promise<Task | null> {
  const result = await pool.query(
    'UPDATE tasks SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}

export async function softDeleteByProjectId(projectId: number): Promise<void> {
  await pool.query(
    'UPDATE tasks SET deleted_at = NOW() WHERE project_id = $1 AND deleted_at IS NULL',
    [projectId]
  );
}

export async function getTasksDueSoon(hoursAhead: number = 24): Promise<Task[]> {
  const result = await pool.query(
    `SELECT * FROM tasks
     WHERE deleted_at IS NULL
       AND due_date IS NOT NULL
       AND due_date <= NOW() + INTERVAL '1 hour' * $1
       AND due_date > NOW()
       AND status != 'done'
     ORDER BY due_date ASC`,
    [hoursAhead]
  );
  return result.rows;
}
