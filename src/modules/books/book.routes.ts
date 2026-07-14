import { Router } from 'express';
import { bookController } from './book.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';
import { validate } from '../../middleware/validate.middleware';
import {
  validateCreateBook,
  validateUpdateBook,
  validateBookId,
  validateBookQuery,
} from './book.validator';

const router = Router();

// Public routes
router.get('/', validate(validateBookQuery, 'query'), bookController.getAll);
router.get('/:id', validate(validateBookId, 'params'), bookController.getById);

// Admin only routes
router.post(
  '/',
  authenticate,
  authorize('admin'),
  validate(validateCreateBook),
  bookController.create
);

router.put(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(validateBookId, 'params'),
  validate(validateUpdateBook),
  bookController.update
);

router.delete(
  '/:id',
  authenticate,
  authorize('admin'),
  validate(validateBookId, 'params'),
  bookController.delete
);

export default router;
