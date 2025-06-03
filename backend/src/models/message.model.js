import mongoose from "mongoose";

// Define the schema for a message
const messageSchema = new mongoose.Schema(
  {
    // ID of the sender (referencing the User model)
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // ID of the receiver (referencing the User model)
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // Optional text message content
    text: {
      type: String,
    },

    // Optional image URL if an image is sent
    image: {
      type: String,
    },
  },
  {
    // Automatically includes createdAt and updatedAt timestamps
    timestamps: true,
  }
);

// Create a Mongoose model based on the schema
const Message = mongoose.model("Message", messageSchema);

// Export the model for use in other parts of the application
export default Message;
