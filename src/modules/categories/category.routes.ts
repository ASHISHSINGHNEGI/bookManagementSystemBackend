import { Router } from 'express';
import { categoryController } from './category.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  validateCreateCategory,
  validateUpdateCategory,
  validateCategoryId,
} from './category.validator';

const router = Router();

router.get('/', categoryController.getAll);
router.get('/:id', validate(validateCategoryId, 'params'), categoryController.getById);

router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(validateCreateCategory),
  categoryController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(validateCategoryId, 'params'),
  validate(validateUpdateCategory),
  categoryController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(validateCategoryId, 'params'),
  categoryController.delete
);

export default router;
