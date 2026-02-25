import { Router } from 'express';
import * as controller from '../controllers/userController';

const router = Router();

router.post('/', controller.createUser);
router.get('/', controller.getUsers);

export default router;
