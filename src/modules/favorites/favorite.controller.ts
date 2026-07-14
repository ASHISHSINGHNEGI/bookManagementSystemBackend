import { Request, Response, NextFunction } from 'express';
import { favoriteService } from './favorite.service';
import { sendSuccess, sendCreated } from '../../utils/response.util';

export const favoriteController = {
  add: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await favoriteService.add(req.user!.id, req.params.bookId);
      sendCreated(res, 'Book added to favorites', data);
    } catch (err) {
      next(err);
    }
  },

  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await favoriteService.getAll(req.user!.id);
      sendSuccess(res, 'Favorites retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },

  remove: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await favoriteService.remove(req.user!.id, req.params.bookId);
      sendSuccess(res, 'Book removed from favorites');
    } catch (err) {
      next(err);
    }
  },
};
