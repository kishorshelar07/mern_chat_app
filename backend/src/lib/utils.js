// Import jsonwebtoken for creating JWT tokens
import jwt from "jsonwebtoken";

/**
 * Generates a JWT token and sets it as an HTTP-only cookie in the response
 *
 * @param {string} userId - The unique user ID to include in the token payload
 * @param {object} res - The response object from Express to set the cookie
 */
export const generateToken = (userId, res) => {
  // Generate a JWT token with the user ID and secret key, valid for 7 days
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });

  // Set the JWT as a cookie on the response object
  res.cookie("jwt", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000, // Cookie valid for 7 days in milliseconds
    httpOnly: true, // Helps prevent XSS (cross-site scripting) attacks
    sameSite: "strict", // Helps protect against CSRF (cross-site request forgery) attacks
    secure: process.env.NODE_ENV !== "development", // Use secure cookies in production (HTTPS only)
  });

  // Return the generated token (optional, for further use)
  return token;
};
