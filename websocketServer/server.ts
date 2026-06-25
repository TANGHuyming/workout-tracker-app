import "dotenv/config";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { connectDB } from "./lib/mongodb.ts";
import NotificationModel from "./models/Notification.ts";
import UserModel from "./models/User.ts";
import ConversationModel from "./models/Conversation.ts";
import MessageModel from "./models/Message.ts";
import mongoose from "mongoose";

await connectDB();
const { ObjectId } = mongoose.Types;
const httpServer = createServer();
const io = new Server(httpServer, {
  cors: { origin: "http://localhost:3000", methods: ["GET", "POST"] },
});
const messageStore = new Map();

// Use a Map or Array to track active users
let onlineUsers: Array<{
  username: string;
  userId: string;
  socketId: string;
  isIdle: boolean;
  currentRoom: string;
}> = [];

io.on("connection", async (socket: Socket) => {
  const { username, userId } = socket.handshake.auth;
  let conversation: any = null;
  console.log("A user has connected: ", username, " with userId: ", userId);
  onlineUsers = onlineUsers.filter((user) => user.userId !== userId);

  onlineUsers.push({
    username,
    userId,
    socketId: socket.id,
    isIdle: true,
    currentRoom: "",
  });

  io.emit("getOnlineUsers", onlineUsers);

  const pending = await NotificationModel.find({
    to: userId,
    read: false,
  });

  if (pending.length > 0) {
    console.log("Sending pending notifications...", pending);
    socket.emit("sendNotification", pending);
  }

  socket.on("checkNotification", async (senderId: any) => {
    await NotificationModel.deleteMany({
      from: senderId,
      to: userId,
      read: false,
    });
  });

  socket.on("acceptFriendRequest", async (friendId: any) => {
    await UserModel.bulkWrite([
      {
        updateOne: {
          filter: { _id: new ObjectId(userId) },
          update: { $addToSet: { friends: friendId } },
        },
      },
      {
        updateOne: {
          filter: { _id: new ObjectId(friendId) },
          update: { $addToSet: { friends: userId } },
        },
      },
    ]);

    try {
      await NotificationModel.create({
        type: "friend_request_accepted",
        to: friendId,
        from: userId,
        read: false,
      });
    } catch (error) {
      console.error(error);
    } finally {
      const friend = onlineUsers.find((user) => user.userId === friendId);
      if (friend) {
        socket.to(friend.socketId).emit("sendNotification", [
          {
            type: "friend_request_accepted",
            to: friendId,
            from: userId,
            read: false,
          },
        ]);
      }
    }
  });

  socket.on("addFriend", async ({ targetUserId }: any) => {
    console.log("Adding friend...", targetUserId);

    try {
      await NotificationModel.create({
        type: "friend_request",
        to: targetUserId,
        from: userId,
        read: false,
      });
    } catch (error) {
      console.error(error);
    } finally {
      const targetUser = onlineUsers.find(
        (user) => user.userId === targetUserId,
      );
      console.log(onlineUsers);
      if (targetUser) {
        socket.to(targetUser.socketId).emit("sendNotification", [
          {
            type: "friend_request",
            to: targetUserId,
            from: userId,
            read: true,
          },
        ]);
      }
    }
  });

  socket.on("joinPrivateChat", async (targetUserId: any) => {
    try {
      conversation = await ConversationModel.findOne({
        participants: {
          $all: [userId, targetUserId],
          $size: 2,
        },
      });

      if (conversation) {
        const payload = await MessageModel.find({
          conversationId: conversation._id,
        });

        socket.emit("pastMessages", payload);
      } else {
        conversation = await ConversationModel.create({
          type: "direct_message",
          participants: [userId, targetUserId],
        });

        throw new Error("No conversation found with this user");
      }
    } catch (error) {
      console.error(error);
    } finally {
      const roomName = [userId, targetUserId].sort().join("--");
      socket.join(roomName);
    }
  });

  // 2. Handle sending private messages without forcing manual room joins
  socket.on("sendPrivateMessage", async ({ targetUserId, message }) => {
    if (!conversation) return;

    const roomName = [userId, targetUserId].sort().join("--");

    // Store message in DB
    const payload = await MessageModel.create({
      conversationId: new ObjectId(conversation._id),
      senderId: userId,
      messageType: "text",
      content: message,
    });

    io.to(roomName).emit("sendPrivateMessage", payload);
  });

  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
    console.log("User disconnected: ", username, ": ", userId);
  });
});

httpServer.listen(8000, () => {
  console.log("Socket server running on port 8000");
});
