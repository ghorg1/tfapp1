import pool from '../../src/config/db';
import { initSchema } from '../../src/config/schema';

let schemaReady = false;

export async function cleanDatabase(): Promise<void> {
  if (!schemaReady) {
    // Drop old tables to ensure schema matches (CREATE TABLE IF NOT EXISTS won't alter existing)
    await pool.query(`
      DROP TABLE IF EXISTS task_history, task_tags, comments, tasks, tags, projects, users CASCADE
    `);
    await initSchema();
    schemaReady = true;
  }
  await pool.query(`
    TRUNCATE task_history, task_tags, comments, tasks, tags, projects, users
    RESTART IDENTITY CASCADE
  `);
}

export async function closeDatabase(): Promise<void> {
  await pool.end();
}
