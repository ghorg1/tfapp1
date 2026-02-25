import pool from '../config/db';
import { Tag, TaskTag } from '../types';

export async function createTag(name: string): Promise<Tag> {
  const result = await pool.query(
    'INSERT INTO tags (name) VALUES ($1) RETURNING *',
    [name]
  );
  return result.rows[0];
}

export async function findById(id: number): Promise<Tag | null> {
  const result = await pool.query('SELECT * FROM tags WHERE id = $1', [id]);
  return result.rows[0] || null;
}

export async function getAllTags(): Promise<Tag[]> {
  const result = await pool.query('SELECT * FROM tags ORDER BY name');
  return result.rows;
}

export async function addTagToTask(taskId: number, tagId: number): Promise<TaskTag> {
  const result = await pool.query(
    'INSERT INTO task_tags (task_id, tag_id) VALUES ($1, $2) ON CONFLICT DO NOTHING RETURNING *',
    [taskId, tagId]
  );
  return result.rows[0] || { task_id: taskId, tag_id: tagId };
}

export async function removeTagFromTask(taskId: number, tagId: number): Promise<void> {
  await pool.query(
    'DELETE FROM task_tags WHERE task_id = $1 AND tag_id = $2',
    [taskId, tagId]
  );
}

export async function getTagsForTask(taskId: number): Promise<Tag[]> {
  const result = await pool.query(
    `SELECT t.* FROM tags t
     INNER JOIN task_tags tt ON t.id = tt.tag_id
     WHERE tt.task_id = $1
     ORDER BY t.name`,
    [taskId]
  );
  return result.rows;
}

export async function deleteTag(id: number): Promise<Tag | null> {
  await pool.query('DELETE FROM task_tags WHERE tag_id = $1', [id]);
  const result = await pool.query('DELETE FROM tags WHERE id = $1 RETURNING *', [id]);
  return result.rows[0] || null;
}
