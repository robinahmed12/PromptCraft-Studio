import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { checkDatabaseConnection } from "./config/db.js";
import { apiRouter } from "./routes/api.routes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Permissive CORS for cross-domain and serverless routing
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  })
);
app.options("*", cors());

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

// Only listen on port when not running as a Vercel serverless function
if (!process.env.VERCEL) {
  startServer().catch((err) => {
    console.error("Fatal startup error:", err);
  });
}

export default app;
export { app };
