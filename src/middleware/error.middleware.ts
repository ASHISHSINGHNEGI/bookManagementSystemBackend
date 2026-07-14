import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../errors/AppError';
import { sendError } from '../utils/response.util';
import { logger } from '../utils/logger.util';
import { appConfig } from '../config/app.config';

export const errorMiddleware = (
  err: Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
): void => {
  // Operational AppError — expected error
  if (err instanceof AppError) {
    if (err.statusCode >= 500) {
      logger.error(`[${req.method}] ${req.path} → ${err.message}`, { stack: err.stack });
    }
    sendError(res, err.message, err.statusCode, err.errors);
    return;
  }

  // Prisma unique constraint violation
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'field';
      sendError(res, `A record with this ${fields} already exists`, 409);
      return;
    }
    if (err.code === 'P2025') {
      sendError(res, 'Record not found', 404);
      return;
    }
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    sendError(res, 'Invalid token', 401);
    return;
  }
  if (err.name === 'TokenExpiredError') {
    sendError(res, 'Token has expired', 401);
    return;
  }

  // Unexpected / programmer error
  logger.error(`Unhandled error: ${err.message}`, { stack: err.stack });
  sendError(
    res,
    appConfig.isProduction ? 'Something went wrong' : err.message,
    500
  );
};
