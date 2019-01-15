import { Router } from 'express';
import * as UserController from './UserController';

const router: Router = Router();

router.post('/', UserController.createUser);

export default router;