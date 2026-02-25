import { Router } from 'express';
import * as controller from '../controllers/userController';
import { authenticate, authorize } from '../middleware/auth';
import { UserRole } from '../types';

const router = Router();

router.use(authenticate);

router.get('/', controller.getUsers);
router.put('/:id/deactivate', authorize(UserRole.ADMIN), controller.deactivateUser);
router.put('/:id/activate', authorize(UserRole.ADMIN), controller.activateUser);

export default router;
