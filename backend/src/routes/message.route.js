import express from "express";
import { protectRoute } from "../middleware/auth.middleware.js";
import { getMessages, getUsersForSidebar, sendMessage } from "../controllers/message.controller.js";

const router = express.Router();

// Route to get list of users (excluding logged-in user) for sidebar (protected)
router.get("/users", protectRoute, getUsersForSidebar);

// Route to get chat messages between logged-in user and user with specified id (protected)
router.get("/:id", protectRoute, getMessages);

// Route to send a message to a user with specified id (protected)
router.post("/send/:id", protectRoute, sendMessage);

export default router;
