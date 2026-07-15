import "dotenv/config";
import express from "express";
import cors from "cors";
import { appConfig } from "./config/app.config";
import { errorMiddleware } from "./middleware/error.middleware";

// Route imports
import authRoutes from "./modules/auth/auth.routes";
import bookRoutes from "./modules/books/book.routes";
import categoryRoutes from "./modules/categories/category.routes";
import favoriteRoutes from "./modules/favorites/favorite.routes";
import adminRoutes from "./modules/admin/admin.routes";

const app = express();

// ─── Core Middleware ───────────────────────────────────────────────────────────
console.log("Allowed Origins:", appConfig.allowedOrigins);
app.use(
  cors({
    origin: appConfig.allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ─── Health Check ──────────────────────────────────────────────────────────────
app.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "Bookstore API is running",
    environment: appConfig.env,
    timestamp: new Date().toISOString(),
  });
});

// ─── API Routes ────────────────────────────────────────────────────────────────
const API_PREFIX = "/api/v1";

app.use(`${API_PREFIX}/auth`, authRoutes);
app.use(`${API_PREFIX}/books`, bookRoutes);
app.use(`${API_PREFIX}/categories`, categoryRoutes);
app.use(`${API_PREFIX}/favorites`, favoriteRoutes);
app.use(`${API_PREFIX}/admin`, adminRoutes);

// ─── 404 Handler ───────────────────────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
    errors: [],
  });
});

// ─── Global Error Handler (must be last) ───────────────────────────────────────
app.use(errorMiddleware);

export default app;
