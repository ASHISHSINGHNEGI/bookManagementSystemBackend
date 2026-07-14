import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';
import { appConfig } from './app.config';

const createPrismaClient = (): PrismaClient => {
  const connectionString = process.env.DATABASE_URL;
  if (!connectionString) {
    throw new Error('Missing required environment variable: DATABASE_URL');
  }

  const pool = new Pool({ connectionString });
  const adapter = new PrismaPg(pool);

  return new PrismaClient({
    adapter,
    log: appConfig.isDevelopment ? ['query', 'error', 'warn'] : ['error'],
  });
};

// Singleton pattern — prevents multiple Prisma instances during hot-reload in dev
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (appConfig.isDevelopment) {
  globalForPrisma.prisma = prisma;
}
