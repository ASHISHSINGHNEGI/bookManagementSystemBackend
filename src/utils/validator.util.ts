import { ValidationError } from '../types/common.types';

export const isEmail = (value: string): boolean =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

export const isUUID = (value: string): boolean =>
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);

export const isNonEmptyString = (value: unknown): value is string =>
  typeof value === 'string' && value.trim().length > 0;

export const isPositiveInteger = (value: unknown): boolean =>
  Number.isInteger(value) || (typeof value === 'string' && /^\d+$/.test(value) && parseInt(value, 10) > 0);

type ValidatorFn = (body: Record<string, unknown>) => ValidationError[];

export const runValidation = (
  data: Record<string, unknown>,
  validatorFn: ValidatorFn
): ValidationError[] => {
  return validatorFn(data);
};

// Field-level helpers used inside validator functions
export const required = (
  errors: ValidationError[],
  field: string,
  value: unknown,
  label?: string
): boolean => {
  if (!isNonEmptyString(value)) {
    errors.push({ field, message: `${label ?? field} is required` });
    return false;
  }
  return true;
};

export const emailRule = (
  errors: ValidationError[],
  field: string,
  value: unknown
): void => {
  if (isNonEmptyString(value) && !isEmail(value)) {
    errors.push({ field, message: 'Must be a valid email address' });
  }
};

export const minLengthRule = (
  errors: ValidationError[],
  field: string,
  value: unknown,
  min: number
): void => {
  if (isNonEmptyString(value) && value.trim().length < min) {
    errors.push({ field, message: `${field} must be at least ${min} characters` });
  }
};

export const urlRule = (
  errors: ValidationError[],
  field: string,
  value: unknown
): void => {
  if (isNonEmptyString(value)) {
    try {
      new URL(value);
    } catch {
      errors.push({ field, message: `${field} must be a valid URL` });
    }
  }
};

export const uuidRule = (
  errors: ValidationError[],
  field: string,
  value: unknown
): void => {
  if (isNonEmptyString(value) && !isUUID(value)) {
    errors.push({ field, message: `${field} must be a valid UUID` });
  }
};

export const enumRule = (
  errors: ValidationError[],
  field: string,
  value: unknown,
  allowed: string[]
): void => {
  if (isNonEmptyString(value) && !allowed.includes(value)) {
    errors.push({ field, message: `${field} must be one of: ${allowed.join(', ')}` });
  }
};
