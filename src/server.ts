import app from "./app";
import { appConfig } from "./config/app.config";
import { prisma } from "./config/database.config";

const PORT = appConfig.port;

const server = app.listen(PORT, () => {
  console.info(`🚀 Server running on port ${PORT} in ${appConfig.env} mode`);
});

// ─── Graceful Shutdown ─────────────────────────────────────────────────────────
const shutdown = async (signal: string) => {
  console.info(`${signal} received. Shutting down gracefully...`);
  server.close(async () => {
    await prisma.$disconnect();
    console.info("Database connection closed.");
    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

// ─── Unhandled Errors ──────────────────────────────────────────────────────────
process.on("unhandledRejection", (reason) => {
  console.error("Unhandled Promise Rejection:", { reason });
  shutdown("unhandledRejection");
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", { error });
  process.exit(1);
});
