import { ValidationError } from '../../types/common.types';
import { required, uuidRule } from '../../utils/validator.util';

export const validateCreateCategory = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  required(errors, 'name', body.name, 'Category name');
  if (body.parentId !== undefined && body.parentId !== null) {
    uuidRule(errors, 'parentId', body.parentId);
  }
  return errors;
};

export const validateUpdateCategory = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  required(errors, 'name', body.name, 'Category name');
  return errors;
};

export const validateCategoryId = (params: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  uuidRule(errors, 'id', params.id);
  return errors;
};
