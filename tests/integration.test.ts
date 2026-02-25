import request from 'supertest';
import app from '../src/app';
import pool from '../src/config/db';

afterAll(async () => {
  await pool.end();
});

test('Create user and task', async () => {
  const user = await request(app)
    .post('/users')
    .send({ name: 'Alice' });

  const task = await request(app)
    .post('/tasks')
    .send({ title: 'Task1', userId: user.body.id });

  expect(task.body.title).toBe('Task1');
});
