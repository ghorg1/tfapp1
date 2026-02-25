import request from 'supertest';
import app from '../../src/app';

export async function registerAndGetToken(
  name: string = 'TestUser',
  email: string = `test-${Date.now()}@example.com`,
  password: string = 'password123'
): Promise<{ token: string; userId: number }> {
  const res = await request(app)
    .post('/auth/register')
    .send({ name, email, password });
  return { token: res.body.token, userId: res.body.user.id };
}
