import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../types/common.types';
import { AppError } from '../errors/AppError';

type ValidatorFn = (data: Record<string, unknown>) => ValidationError[];

type ValidationTarget = 'body' | 'query' | 'params';

export const validate = (
  validatorFn: ValidatorFn,
  target: ValidationTarget = 'body'
) => {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const data = req[target] as Record<string, unknown>;
    const errors = validatorFn(data);

    if (errors.length > 0) {
      return next(AppError.badRequest('Validation Failed', errors));
    }

    next();
  };
};
