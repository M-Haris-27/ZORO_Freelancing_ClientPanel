import express from "express";
import {
  createNotification,
  getUserNotifications,
  markAsRead,
  deleteNotification,
} from "../Controller/notification.controller.js";

const router = express.Router();

// Create a new notification
router.post("/", createNotification);

// Get all notifications for a user
router.get("/:userId", getUserNotifications);

// Mark a notification as read
router.patch("/:notificationId/read", markAsRead);

// Delete a notification
router.delete("/:notificationId", deleteNotification);

export default router;
