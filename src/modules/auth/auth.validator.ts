import { ValidationError } from '../../types/common.types';
import { required, emailRule, minLengthRule, enumRule } from '../../utils/validator.util';

export const validateRegister = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];

  required(errors, 'name', body.name, 'Name');
  if (required(errors, 'email', body.email, 'Email')) {
    emailRule(errors, 'email', body.email);
  }
  if (required(errors, 'password', body.password, 'Password')) {
    minLengthRule(errors, 'password', body.password, 6);
  }
  enumRule(errors, 'role', body.role ?? 'user', ['admin', 'user']);

  return errors;
};

export const validateLogin = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];

  if (required(errors, 'email', body.email, 'Email')) {
    emailRule(errors, 'email', body.email);
  }
  required(errors, 'password', body.password, 'Password');

  return errors;
};

export const validateRefreshToken = (body: Record<string, unknown>): ValidationError[] => {
  const errors: ValidationError[] = [];
  required(errors, 'refreshToken', body.refreshToken, 'Refresh token');
  return errors;
};
