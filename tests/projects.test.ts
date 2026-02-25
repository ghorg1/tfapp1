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

describe('Projects', () => {
  test('Create and list projects', async () => {
    const { token } = await registerAndGetToken();

    const create = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project1', description: 'Test project' });

    expect(create.status).toBe(201);
    expect(create.body.name).toBe('Project1');

    const list = await request(app)
      .get('/projects')
      .set('Authorization', `Bearer ${token}`);

    expect(list.body.length).toBe(1);
  });

  test('Reject duplicate project name for same owner', async () => {
    const { token } = await registerAndGetToken();

    await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project1' });

    const res = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project1' });

    expect(res.status).toBe(400);
  });

  test('Soft-delete project cascades to tasks', async () => {
    const { token } = await registerAndGetToken();

    const project = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Project1' });

    await request(app)
      .post('/tasks')
      .set('Authorization', `Bearer ${token}`)
      .send({ title: 'Task in project', projectId: project.body.id });

    await request(app)
      .delete(`/projects/${project.body.id}`)
      .set('Authorization', `Bearer ${token}`);

    // Task should not appear in list (soft-deleted)
    const tasks = await request(app)
      .get('/tasks')
      .set('Authorization', `Bearer ${token}`);

    expect(tasks.body.length).toBe(0);
  });

  test('Non-owner cannot access project', async () => {
    const { token: ownerToken } = await registerAndGetToken('Owner', 'owner@example.com');
    const { token: otherToken } = await registerAndGetToken('Other', 'other@example.com');

    const project = await request(app)
      .post('/projects')
      .set('Authorization', `Bearer ${ownerToken}`)
      .send({ name: 'Private Project' });

    const res = await request(app)
      .get(`/projects/${project.body.id}`)
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(403);
  });
});
