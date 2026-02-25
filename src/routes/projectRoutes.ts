import { Router } from 'express';
import * as controller from '../controllers/projectController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', controller.createProject);
router.get('/', controller.getProjects);
router.get('/:id', controller.getProject);
router.put('/:id', controller.updateProject);
router.delete('/:id', controller.deleteProject);

export default router;
