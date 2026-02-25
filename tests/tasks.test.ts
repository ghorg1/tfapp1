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

describe('Tasks', () => {
  test('Create task with auth', async () => {
    const { token } = await registerAndGetToken();

    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'My Task' });

    expect(res.status).toBe(201);
    expect(res.body.title).toBe('My Task');
    expect(res.body.status).toBe('open');
  });

  test('Reject assign to inactive user', async () => {
    const { token, userId } = await registerAndGetToken('Creator', 'creator@example.com');
    const { userId: targetId } = await registerAndGetToken('Target', 'target@example.com');

    // Deactivate target user
    const pool = require('../src/config/db').default;
    await pool.query('UPDATE users SET active = false WHERE id = $1', [targetId]);

    const res = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task', assignedTo: targetId });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/inactive/);
  });

  test('Update task authorization', async () => {
    const { token: ownerToken } = await registerAndGetToken('Owner', 'owner@example.com');
    const { token: otherToken } = await registerAndGetToken('Other', 'other@example.com');

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ title: 'Owner Task' });

    // Other user cannot update
    const res = await request(app)
      .put(`/tasks/${task.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ title: 'Hacked' });

    expect(res.status).toBe(403);
  });

  test('Soft-delete task', async () => {
    const { token } = await registerAndGetToken();

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Delete me' });

    await request(app)
      .delete(`/tasks/${task.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    const list = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(list.body.length).toBe(0);
  });

  test('Filter tasks by status', async () => {
    const { token } = await registerAndGetToken();

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task1' });

    await request(app)
      .put(`/tasks/${task.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'done' });

    const open = await request(app)
      .get('/tasks?status=open')
      .set('Authorization', `Bearer ${token}`);

    expect(open.body.length).toBe(0);

    const done = await request(app)
      .get('/tasks?status=done')
      .set('Authorization', `Bearer ${token}`);

    expect(done.body.length).toBe(1);
  });

  test('Task history is recorded', async () => {
    const { token } = await registerAndGetToken();

    const task = await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Audited Task' });

    await request(app)
      .put(`/tasks/${task.body.id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({ status: 'in_progress' });

    const history = await request(app)
      .get(`/tasks/${task.body.id}/history`)
      .set('Authorization', `Bearer ${token}`);

    expect(history.body.length).toBe(2); // created + updated
    expect(history.body[0].action).toBe('task_created');
    expect(history.body[1].action).toBe('task_updated');
  });
});
