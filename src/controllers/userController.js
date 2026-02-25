const userService = require('../services/userService');

exports.createUser = async (req, res, next) => {
  try {
    const user = await userService.createUser(req.body.name);
    res.json(user);
  } catch (err) {
    next(err);
  }
};

exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.getUsers();
    res.json(users);
  } catch (err) {
    next(err);
  }
};
