import { Request, Response, NextFunction } from 'express';
import { categoryService } from './category.service';
import { sendSuccess, sendCreated } from '../../utils/response.util';

export const categoryController = {
  getAll: async (_req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await categoryService.getAll();
      sendSuccess(res, 'Categories retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },

  getById: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await categoryService.getById(req.params.id);
      sendSuccess(res, 'Category retrieved successfully', data);
    } catch (err) {
      next(err);
    }
  },

  create: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await categoryService.create(req.body);
      sendCreated(res, 'Category created successfully', data);
    } catch (err) {
      next(err);
    }
  },

  update: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const data = await categoryService.update(req.params.id, req.body);
      sendSuccess(res, 'Category updated successfully', data);
    } catch (err) {
      next(err);
    }
  },

  delete: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await categoryService.delete(req.params.id);
      sendSuccess(res, 'Category deleted successfully');
    } catch (err) {
      next(err);
    }
  },
};
