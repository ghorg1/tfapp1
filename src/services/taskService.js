const taskModel = require('../models/taskModel');

async function createTask(title, userId) {
  if (!title) throw new Error('Title required');
  return taskModel.createTask(title, userId);
}

async function getTasks() {
  return taskModel.getTasks();
}

module.exports = { createTask, getTasks };
