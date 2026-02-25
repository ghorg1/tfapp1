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

describe('Comments', () => {
  test('Add and list comments', async () => {
    const { token } = await registerAndGetToken();

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task1' });

    const comment = await request(app)
      .post(`/tasks/${task.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'Great work!' });

    expect(comment.status).toBe(201);
    expect(comment.body.body).toBe('Great work!');

    const list = await request(app)
      .get(`/tasks/${task.body.id}/comments`)
      .set('Authorization', `Bearer ${token}`);

    expect(list.body.length).toBe(1);
  });

  test('Comment on missing task returns 404', async () => {
    const { token } = await registerAndGetToken();

    const res = await request(app)
      .post('/tasks/99999/comments')
      .set('Authorization', `Bearer ${token}`)
      .send({ body: 'No task here' });

    expect(res.status).toBe(404);
  });
});
