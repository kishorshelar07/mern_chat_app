// Import required models and libraries
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import cloudinary from "../lib/cloudinary.js";
import { getReceiverSocketId, io } from "../lib/socket.js";

// Get all users except the logged-in user for sidebar listing
export const getUsersForSidebar = async (req, res) => {
  try {
    const loggedInUserId = req.user._id; // Get logged-in user ID from request

    // Fetch all users excluding the currently logged-in user, and remove password field
    const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");

    // Send the filtered user list as response
    res.status(200).json(filteredUsers);
  } catch (error) {
    console.error("Error in getUsersForSidebar: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Get all messages between the logged-in user and another specific user
export const getMessages = async (req, res) => {
  try {
    const { id: userToChatId } = req.params; // User to chat with
    const myId = req.user._id; // Logged-in user ID

    // Fetch all messages where the sender and receiver match either direction
    const messages = await Message.find({
      $or: [
        { senderId: myId, receiverId: userToChatId },
        { senderId: userToChatId, receiverId: myId },
      ],
    });

    // Return all matched messages
    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Send a message to another user (text and/or image)
export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body; // Message content
    const { id: receiverId } = req.params; // Receiver user ID
    const senderId = req.user._id; // Sender user ID

    let imageUrl;
    if (image) {
      // Upload image to Cloudinary if image is provided (base64 string)
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url; // Get secure URL of uploaded image
    }

    // Create new message document
    const newMessage = new Message({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // Save the message to the database
    await newMessage.save();

    // Get socket ID of the receiver if they are connected
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // Emit real-time socket event to the receiver
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // Send the newly created message as response
    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage controller: ", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};
