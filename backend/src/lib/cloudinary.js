// Import Cloudinary SDK (v2 version)
import { v2 as cloudinary } from "cloudinary";

// Import dotenv to load environment variables from .env file
import { config } from "dotenv";

// Initialize dotenv to use environment variables
config();

// Configure Cloudinary with your credentials from environment variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME, // Your Cloudinary cloud name
  api_key: process.env.CLOUDINARY_API_KEY,       // Your Cloudinary API key
  api_secret: process.env.CLOUDINARY_API_SECRET, // Your Cloudinary API secret
});

// Export configured cloudinary instance for use in other files
export default cloudinary;
