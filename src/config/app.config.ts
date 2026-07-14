import dotenv from "dotenv";

dotenv.config();

const requireEnv = (key: string): string => {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
};

export const appConfig = {
  env: process.env.NODE_ENV ?? "development",
  port: parseInt(process.env.PORT ?? "3000", 10),
  allowedOrigins: (
    process.env.ALLOWED_ORIGINS ?? "http://localhost:3000"
  ).split(","),
  isDevelopment: (process.env.NODE_ENV ?? "development") === "development",
  isProduction: process.env.NODE_ENV === "production",
} as const;

export const jwtConfig = {
  accessSecret: requireEnv("JWT_ACCESS_SECRET"),
  refreshSecret: requireEnv("JWT_REFRESH_SECRET"),
  accessExpiresIn: process.env.JWT_ACCESS_EXPIRES_IN ?? "15m",
  refreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN ?? "7d",
} as const;

export const bcryptConfig = {
  rounds: parseInt(process.env.BCRYPT_ROUNDS ?? "12", 10),
} as const;
