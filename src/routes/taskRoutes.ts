import { Router } from 'express';
import * as controller from '../controllers/taskController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', controller.createTask);
router.get('/', controller.getTasks);
router.get('/:id', controller.getTask);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);
router.get('/:id/history', controller.getTaskHistory);

export default router;
