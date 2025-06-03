import jwt from "jsonwebtoken";
import User from "../models/user.model.js";

// Middleware to protect routes
export const protectRoute = async (req, res, next) => {
  try {
    // Get JWT token from cookies
    const token = req.cookies.jwt;

    // If no token is found, return unauthorized error
    if (!token) {
      return res.status(401).json({ message: "Unauthorized - No Token Provided" });
    }

    // Verify the token using the secret key from .env
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // If token is invalid, return unauthorized error
    if (!decoded) {
      return res.status(401).json({ message: "Unauthorized - Invalid Token" });
    }

    // Find the user by ID from the decoded token, excluding the password
    const user = await User.findById(decoded.userId).select("-password");

    // If user is not found in the database, return error
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Attach the user object to the request for access in the next middleware/controller
    req.user = user;

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    // Catch any errors and return internal server error
    console.log("Error in protectRoute middleware: ", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
};
