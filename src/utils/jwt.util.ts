import jwt from 'jsonwebtoken';
import { jwtConfig } from '../config/app.config';
import { JwtAccessPayload, JwtRefreshPayload } from '../types/common.types';

export const signAccessToken = (userId: string, role: string): string => {
  return jwt.sign(
    { sub: userId, role, type: 'access' } as JwtAccessPayload,
    jwtConfig.accessSecret,
    { expiresIn: jwtConfig.accessExpiresIn } as jwt.SignOptions
  );
};

export const signRefreshToken = (userId: string): string => {
  return jwt.sign(
    { sub: userId, type: 'refresh' } as JwtRefreshPayload,
    jwtConfig.refreshSecret,
    { expiresIn: jwtConfig.refreshExpiresIn } as jwt.SignOptions
  );
};

export const verifyAccessToken = (token: string): JwtAccessPayload => {
  return jwt.verify(token, jwtConfig.accessSecret) as JwtAccessPayload;
};

export const verifyRefreshToken = (token: string): JwtRefreshPayload => {
  return jwt.verify(token, jwtConfig.refreshSecret) as JwtRefreshPayload;
};
