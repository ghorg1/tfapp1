import pool from '../config/db';
import { Project } from '../types';

export async function createProject(name: string, description: string | null, ownerId: number): Promise<Project> {
  const result = await pool.query(
    'INSERT INTO projects (name, description, owner_id) VALUES ($1, $2, $3) RETURNING *',
    [name, description, ownerId]
  );
  return result.rows[0];
}

export async function findById(id: number): Promise<Project | null> {
  const result = await pool.query(
    'SELECT * FROM projects WHERE id = $1 AND deleted_at IS NULL',
    [id]
  );
  return result.rows[0] || null;
}

export async function getProjectsByOwner(ownerId: number): Promise<Project[]> {
  const result = await pool.query(
    'SELECT * FROM projects WHERE owner_id = $1 AND deleted_at IS NULL ORDER BY created_at DESC',
    [ownerId]
  );
  return result.rows;
}

export async function getAllProjects(): Promise<Project[]> {
  const result = await pool.query(
    'SELECT * FROM projects WHERE deleted_at IS NULL ORDER BY created_at DESC'
  );
  return result.rows;
}

export async function updateProject(id: number, name: string, description: string | null): Promise<Project | null> {
  const result = await pool.query(
    'UPDATE projects SET name = $1, description = $2 WHERE id = $3 AND deleted_at IS NULL RETURNING *',
    [name, description, id]
  );
  return result.rows[0] || null;
}

export async function softDelete(id: number): Promise<Project | null> {
  const result = await pool.query(
    'UPDATE projects SET deleted_at = NOW() WHERE id = $1 AND deleted_at IS NULL RETURNING *',
    [id]
  );
  return result.rows[0] || null;
}
