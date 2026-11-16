import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDatabaseConnection } from "./config/db.js";
import { apiRouter } from "./routes/api.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api", apiRouter);

// Start server
async function startServer() {
  console.log("⚡ Starting AI-Chat Backend Server...");
  
  // Health check on boot
  const dbHealth = await checkDatabaseConnection();
  if (dbHealth.ok) {
    console.log("✅ [Neon DB] Connected successfully to Serverless PostgreSQL.");
  } else {
    console.error("❌ [Neon DB Connection Error]:", dbHealth.message);
  }

  app.listen(PORT, () => {
    console.log(`🚀 Server running on http://localhost:${PORT}`);
    console.log(`📡 Healthcheck available at http://localhost:${PORT}/api/health`);
  });
}

startServer().catch((err) => {
  console.error("Fatal startup error:", err);
  process.exit(1);
});
