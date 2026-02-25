const userModel = require('../models/userModel');

async function createUser(name) {
  if (!name) throw new Error('Name required');
  return userModel.createUser(name);
}

async function getUsers() {
  return userModel.getAllUsers();
}

module.exports = { createUser, getUsers };
