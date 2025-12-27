import "dotenv/config";
import express from "express";
import cors from "cors";
import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";
import { processEmailQueue } from "./lib/email.js";

const app = express();

// CORS configuration
app.use(
  cors({
    origin: process.env.FRONTEND_URL || "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Health check endpoint
app.get("/health", (_req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Better Auth handler - handles all /api/auth/* routes
app.all("/api/auth/*", toNodeHandler(auth));

// Error handling middleware
app.use(
  (
    err: Error,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error("Server error:", err);
    res.status(500).json({
      code: "INTERNAL_ERROR",
      message: "An unexpected error occurred",
    });
  }
);

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    code: "NOT_FOUND",
    message: "Endpoint not found",
  });
});

const PORT = parseInt(process.env.PORT || process.env.API_PORT || "3001");

app.listen(PORT, "0.0.0.0", () => {
  console.log(`Auth API server running on port ${PORT}`);
  console.log(`Health check: /health`);
  console.log(`Auth endpoints: /api/auth/*`);
});

// Process email queue every minute
setInterval(async () => {
  try {
    await processEmailQueue();
  } catch (error) {
    console.error("Email queue processing error:", error);
  }
}, 60 * 1000);

export default app;
