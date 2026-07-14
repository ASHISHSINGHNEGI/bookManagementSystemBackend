import { Router } from 'express';
import { authController } from './auth.controller';
import { validate } from '../../middleware/validate.middleware';
import { authenticate } from '../../middleware/auth.middleware';
import { validateRegister, validateLogin, validateRefreshToken } from './auth.validator';

const router = Router();

router.post('/register', validate(validateRegister), authController.register);
router.post('/login', validate(validateLogin), authController.login);
router.post('/refresh', validate(validateRefreshToken), authController.refresh);
router.post('/logout', authenticate, authController.logout);

export default router;
