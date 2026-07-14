import { Router } from 'express';
import { adminController } from './admin.controller';
import { authenticate } from '../../middleware/auth.middleware';
import { authorize } from '../../middleware/rbac.middleware';

const router = Router();

router.use(authenticate, authorize('admin'));

router.get('/reports/favorites', adminController.getFavoritesReport);

export default router;
