import { Router } from 'express';
import * as controller from '../controllers/tagController';
import { authenticate } from '../middleware/auth';

const router = Router();

router.use(authenticate);

router.post('/', controller.createTag);
router.get('/', controller.getAllTags);
router.get('/task/:taskId', controller.getTagsForTask);
router.post('/:id/task', controller.addTagToTask);
router.delete('/:id/task', controller.removeTagFromTask);
router.delete('/:id', controller.deleteTag);

export default router;
