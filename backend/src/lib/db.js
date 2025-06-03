// Import mongoose library for MongoDB connection
import mongoose from "mongoose";

// Function to connect to MongoDB database
export const connectDB = async () => {
  try {
    // Attempt to connect using the URI stored in environment variables
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    // Log success message with the connected host
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (error) {
    // Log error message if connection fails
    console.log("MongoDB connection error:", error);
  }
};
