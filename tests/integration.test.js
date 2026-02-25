const request = require('supertest');
const app = require('../src/app');

test('Create user and task', async () => {
  const user = await request(app)
    .post('/users')
    .send({ name: 'Alice' });

  const task = await request(app)
    .post('/tasks')
    .send({ title: 'Task1', userId: user.body.id });

  expect(task.body.title).toBe('Task1');
});
