import { Response } from 'express';
import { ApiResponse, PaginatedResponse, ValidationError } from '../types/common.types';

export const sendSuccess = <T>(
  res: Response,
  message: string,
  data?: T,
  statusCode = 200
): Response => {
  const response: ApiResponse<T> = { success: true, message, data };
  return res.status(statusCode).json(response);
};

export const sendCreated = <T>(res: Response, message: string, data?: T): Response => {
  return sendSuccess(res, message, data, 201);
};

export const sendError = (
  res: Response,
  message: string,
  statusCode = 500,
  errors: ValidationError[] = []
): Response => {
  const response: ApiResponse = { success: false, message, errors };
  return res.status(statusCode).json(response);
};

export const sendPaginated = <T>(
  res: Response,
  message: string,
  result: PaginatedResponse<T>
): Response => {
  return res.status(200).json({ success: true, message, ...result });
};
