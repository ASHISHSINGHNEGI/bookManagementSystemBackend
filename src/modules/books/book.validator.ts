import { ValidationError } from '../../types/common.types';
import { required, urlRule, uuidRule } from '../../utils/validator.util';

export const validateCreateBook = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];

  required(errors, 'title', body.title, 'Title');
  required(errors, 'author', body.author, 'Author');
  if (required(errors, 'categoryId', body.categoryId, 'Category ID')) {
    uuidRule(errors, 'categoryId', body.categoryId);
  }
  if (body.coverImage) {
    urlRule(errors, 'coverImage', body.coverImage);
  }

  return errors;
};

export const validateUpdateBook = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (body.title !== undefined) required(errors, 'title', body.title, 'Title');
  if (body.author !== undefined) required(errors, 'author', body.author, 'Author');
  if (body.categoryId !== undefined) {
    if (required(errors, 'categoryId', body.categoryId, 'Category ID')) {
      uuidRule(errors, 'categoryId', body.categoryId);
    }
  }
  if (body.coverImage !== undefined && body.coverImage !== null) {
    urlRule(errors, 'coverImage', body.coverImage);
  }

  return errors;
};

export const validateBookId = (params: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  uuidRule(errors, 'id', params.id);
  return errors;
};

export const validateBookQuery = (query: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (query.categoryId) uuidRule(errors, 'categoryId', query.categoryId);
  const allowedSortFields = ['title', 'author', 'createdAt'];
  if (query.sortBy && !allowedSortFields.includes(String(query.sortBy))) {
    errors.push({ field: 'sortBy', message: `sortBy must be one of: ${allowedSortFields.join(', ')}` });
  }
  const allowedOrders = ['asc', 'desc'];
  if (query.order && !allowedOrders.includes(String(query.order))) {
    errors.push({ field: 'order', message: 'order must be asc or desc' });
  }

  return errors;
};
