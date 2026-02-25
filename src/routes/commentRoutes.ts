import { Router } from 'express';
import * as controller from '../controllers/commentController';
import { authenticate } from '../middleware/auth';

const router = Router({ mergeParams: true });

router.use(authenticate);

router.post('/', controller.addComment);
router.get('/', controller.getComments);

export default router;
