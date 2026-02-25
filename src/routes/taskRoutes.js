const express = require('express');
const controller = require('../controllers/taskController');

const router = express.Router();

router.post('/', controller.createTask);
router.get('/', controller.getTasks);

module.exports = router;
