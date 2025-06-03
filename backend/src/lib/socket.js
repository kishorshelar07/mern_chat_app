// Import necessary modules
import { Server } from "socket.io";
import http from "http";
import express from "express";

// Create an Express application
const app = express();

// Create an HTTP server from the Express app
const server = http.createServer(app);

// Initialize a new Socket.io server instance with CORS configuration
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"], // Frontend origin allowed to connect
  },
});

// In-memory object to store online users and their socket IDs
const userSocketMap = {}; // Format: { userId: socketId }

// Function to retrieve a user's socket ID using their user ID
export function getReceiverSocketId(userId) {
  return userSocketMap[userId];
}

// Socket.io connection event listener
io.on("connection", (socket) => {
  console.log("A user connected", socket.id);

  // Get the userId from the client's handshake query
  const userId = socket.handshake.query.userId;

  // Map the connected user's ID to their socket ID
  if (userId) userSocketMap[userId] = socket.id;

  // Notify all connected clients about the currently online users
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  // Handle client disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected", socket.id);

    // Remove the user from the map
    delete userSocketMap[userId];

    // Update the client-side list of online users
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

// Export the Socket.io server, Express app, and HTTP server
export { io, app, server };
