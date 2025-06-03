import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js";
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

// Route for user signup (registration)
router.post("/signup", signup);

// Route for user login (authentication)
router.post("/login", login);

// Route to logout user and clear JWT cookie
router.post("/logout", logout);

// Route to update user profile (protected, requires authentication)
router.put("/update-profile", protectRoute, updateProfile);

// Route to check if user is authenticated (protected)
router.get("/check", protectRoute, checkAuth);

export default router;
