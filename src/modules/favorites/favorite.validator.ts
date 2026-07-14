import { ValidationError } from '../../types/common.types';
import { uuidRule } from '../../utils/validator.util';

export const validateBookIdParam = (params: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  uuidRule(errors, 'bookId', params.bookId);
  return errors;
};
