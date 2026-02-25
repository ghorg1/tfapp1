jest.mock('../src/jobs/queues', () => ({
  enqueueTaskAssigned: jest.fn().mockResolvedValue(undefined),
  enqueueCommentAdded: jest.fn().mockResolvedValue(undefined),
  setupRecurringJobs: jest.fn().mockResolvedValue(undefined),
}));

import request from 'supertest';
import app from '../src/app';
import { cleanDatabase, closeDatabase } from './helpers/setup';

beforeEach(async () => {
  await cleanDatabase();
});

afterAll(async () => {
  await closeDatabase();
});

describe('Auth', () => {
  test('Register a new user', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

    expect(res.status).toBe(201);
    expect(res.body.user.email).toBe('alice@example.com');
    expect(res.body.token).toBeDefined();
    expect(res.body.user.password_hash).toBeUndefined();
  });

  test('Login with valid credentials', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeDefined();
  });

  test('Reject duplicate email', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Alice2', email: 'alice@example.com', password: 'password456' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/already registered/);
  });

  test('Reject short password', async () => {
    const res = await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: '12345' });

    expect(res.status).toBe(400);
    expect(res.body.error).toMatch(/at least 6/);
  });

  test('Reject wrong password', async () => {
    await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'wrongpassword' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/Invalid credentials/);
  });

  test('Reject login for deactivated account', async () => {
    // Register user, then deactivate via direct DB
    const reg = await request(app)
      .post('/auth/register')
      .send({ name: 'Alice', email: 'alice@example.com', password: 'password123' });

    // Deactivate via admin endpoint — need to make user admin first
    const pool = require('../src/config/db').default;
    await pool.query('UPDATE users SET active = false WHERE id = $1', [reg.body.user.id]);

    const res = await request(app)
      .post('/auth/login')
      .send({ email: 'alice@example.com', password: 'password123' });

    expect(res.status).toBe(401);
    expect(res.body.error).toMatch(/deactivated/);
  });
});
