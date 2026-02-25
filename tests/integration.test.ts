jest.mock('../src/jobs/queues', () => ({
  enqueueTaskAssigned: jest.fn().mockResolvedValue(undefined),
  enqueueCommentAdded: jest.fn().mockResolvedValue(undefined),
  setupRecurringJobs: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import app from '../src/app';
import { cleanDatabase, closeDatabase } from './helpers/setup';
import { registerAndGetToken } from './helpers/auth';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

test('Register user, create task, and list tasks', async () => {
  const { token } = await registerAndGetToken('Alice', 'alice@example.com');

  const task = await request(app)
    .post('/tasks')
    .set('Authorization', `Bearer ${token}`)
    .send({ title: 'Task1' });

  expect(task.status).toBe(201);
  expect(task.body.title).toBe('Task1');

  const tasks = await request(app)
    .get('/tasks')
    .set('Authorization', `Bearer ${token}`);

  expect(tasks.body.length).toBe(1);
});

test('Unauthenticated request is rejected', async () => {
  const res = await request(app).get('/tasks');
  expect(res.status).toBe(401);
});
