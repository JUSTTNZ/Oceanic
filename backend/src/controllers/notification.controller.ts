import { asyncHandler } from "../utils/AsyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Notification } from "../models/notification.model.js";
import { Request, Response } from "express";

// Get all notifications for the logged-in user
const getNotifications = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.profile?._id;

    if (!userId) {
      throw new ApiError({ statusCode: 401, message: "User not authenticated" });
    }

    const notifications = await Notification.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(
      new ApiResponse(200, "Notifications fetched successfully", notifications)
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to fetch notifications",
    });
  }
});

// Get unread notification count
const getUnreadCount = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.profile?._id;

    if (!userId) {
      throw new ApiError({ statusCode: 401, message: "User not authenticated" });
    }

    const count = await Notification.countDocuments({ userId, isRead: false });

    res.status(200).json(
      new ApiResponse(200, "Unread count fetched", { unreadCount: count })
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to fetch unread count",
    });
  }
});

// Mark a notification as read
const markAsRead = asyncHandler(async (req: Request, res: Response) => {
  try {
    const { notificationId } = req.params;
    const userId = req.profile?._id;

    if (!userId) {
      throw new ApiError({ statusCode: 401, message: "User not authenticated" });
    }

    const notification = await Notification.findOne({ _id: notificationId, userId });

    if (!notification) {
      throw new ApiError({ statusCode: 404, message: "Notification not found" });
    }

    notification.isRead = true;
    await notification.save();

    res.status(200).json(
      new ApiResponse(200, "Notification marked as read", notification)
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to mark notification as read",
    });
  }
});

// Mark all notifications as read
const markAllAsRead = asyncHandler(async (req: Request, res: Response) => {
  try {
    const userId = req.profile?._id;

    if (!userId) {
      throw new ApiError({ statusCode: 401, message: "User not authenticated" });
    }

    await Notification.updateMany({ userId, isRead: false }, { isRead: true });

    res.status(200).json(
      new ApiResponse(200, "All notifications marked as read", {})
    );
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError({
      statusCode: 500,
      message: error instanceof Error ? error.message : "Failed to mark all as read",
    });
  }
});

export {
  getNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
};
