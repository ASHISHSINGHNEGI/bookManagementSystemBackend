import app from "./app";
import { appConfig } from "./config/app.config";
import { prisma } from "./config/database.config";
import { logger } from "./utils/logger.util";

const PORT = appConfig.port;

const server = app.listen(PORT, () => {
  logger.info(`🚀 Server running on port ${PORT} in ${appConfig.env} mode`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  logger.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    logger.info("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Unhandled Errors ──────────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  logger.error("Unhandled Promise Rejection:", { reason });
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  logger.error("Uncaught Exception:", { error });
  process.exit(1);
});
