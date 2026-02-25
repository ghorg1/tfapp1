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

describe('Tags', () => {
  test('Create tag', async () => {
    const { token } = await registerAndGetToken();

    const res = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'urgent' });

    expect(res.status).toBe(201);
    expect(res.body.name).toBe('urgent');
  });

  test('Add and remove tag from task', async () => {
    const { token } = await registerAndGetToken();

    const tag = await request(app)
      .post('/tags')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'bug' });

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Fix bug' });

    // Add tag to task
    await request(app)
      .post(`/tags/${tag.body.id}/task`)
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: task.body.id });

    // Get tags for task
    const tags = await request(app)
      .get(`/tags/task/${task.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(tags.body.length).toBe(1);
    expect(tags.body[0].name).toBe('bug');

    // Remove tag from task
    await request(app)
      .delete(`/tags/${tag.body.id}/task`)
      .set('Authorization', `Bearer ${token}`)
      .send({ taskId: task.body.id });

    const tagsAfter = await request(app)
      .get(`/tags/task/${task.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    expect(tagsAfter.body.length).toBe(0);
  });
});
