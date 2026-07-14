import { Router } from 'express';
import { favoriteController } from './favorite.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { validate } from '../../middleware/validate.middleware';
import { validateBookIdParam } from './favorite.validator';

const router = Router();

// All favorites routes require authentication
router.use(authenticate);

router.post('/:bookId', validate(validateBookIdParam, 'params'), favoriteController.add);
router.get('/', favoriteController.getAll);
router.delete('/:bookId', validate(validateBookIdParam, 'params'), favoriteController.remove);

export default router;
