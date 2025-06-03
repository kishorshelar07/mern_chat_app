import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import cors from "cors";

import path from "path";

import { connectDB } from "./src/lib/db.js";

import authRoutes from "./src/routes/auth.route.js";
import messageRoutes from "./src/routes/message.route.js";
import { app, server } from "./src/lib/socket.js";

dotenv.config(); // Load environment variables from .env file

const PORT = process.env.PORT;
const __dirname = path.resolve();

app.use(express.json()); // Middleware to parse JSON request bodies
app.use(cookieParser()); // Middleware to parse cookies

// Enable CORS to allow requests from frontend (http://localhost:5173) with credentials (cookies)
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Routes for authentication and messaging APIs
app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

// Serve frontend production build files when in production mode
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../frontend/dist")));

  // For any unmatched route, send back index.html (for SPA routing)
  app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "dist", "index.html"));
  });
}

// Start the HTTP server and connect to MongoDB
server.listen(PORT, () => {
  console.log("server is running on PORT:" + PORT);
  connectDB();
});
