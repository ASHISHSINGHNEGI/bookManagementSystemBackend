import { Request, Response, NextFunction } from 'express';
import { adminService } from './admin.service';
import { sendSuccess } from '../../utils/response.util';

export const adminController = {
  getFavoritesReport: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await adminService.getFavoritesReport();
      sendSuccess(res, 'Favorites report retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },
};
