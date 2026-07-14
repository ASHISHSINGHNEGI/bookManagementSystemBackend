import { Request, Response, NextFunction } from 'express';
import { bookService } from './book.service';
import { sendSuccess, sendCreated, sendPaginated } from '../../utils/response.util';

export const bookController = {
  getAll: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const result = await bookService.getAll(req.query as Record<string, unknown>);
      sendPaginated(res, 'Books retrieved successfully', result);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await bookService.getById(req.params.id);
      sendSuccess(res, 'Book retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await bookService.create(req.body, req.user!.id);
      sendCreated(res, 'Book created successfully', data);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await bookService.update(req.params.id, req.body);
      sendSuccess(res, 'Book updated successfully', data);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await bookService.delete(req.params.id);
      sendSuccess(res, 'Book deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
