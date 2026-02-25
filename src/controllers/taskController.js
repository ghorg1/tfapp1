const taskService = require('../services/taskService');

exports.createTask = async (req, res, next) => {
  try {
    const task = await taskService.createTask(
      req.body.title,
      req.body.userId
    );
    res.json(task);
  } catch (err) {
    next(err);
  }
};

exports.getTasks = async (req, res, next) => {
  try {
    const tasks = await taskService.getTasks();
    res.json(tasks);
  } catch (err) {
    next(err);
  }
};
