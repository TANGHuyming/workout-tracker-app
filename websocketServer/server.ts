import "dotenv/config";
import { createServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import mongoose from "mongoose";
import { connectDB } from "./lib/mongodb";
import NotificationModel from "./models/Notification";
import UserModel from "./models/User";
import ConversationModel from "./models/Conversation";
import MessageModel from "./models/Message";

const { ObjectId } = mongoose.Types;
const PORT = process.env.PORT || 3001;

const httpServer = createServer();
const io = new SocketServer(httpServer, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

let onlineUsers: Array<{
  username: string;
  userId: string;
  socketId: string;
  isIdle: boolean;
  currentRoom: string;
}> = [];

async function main() {
  await connectDB();

  io.on("connection", async (socket: Socket) => {
    const { username, userId } = socket.handshake.auth;
    let conversation: any = null;

    console.log("A user has connected:", username, "userId:", userId);

    onlineUsers = onlineUsers.filter((user) => user.userId !== userId);
    onlineUsers.push({
      username,
      userId,
      socketId: socket.id,
      isIdle: true,
      currentRoom: "",
    });
    io.emit("getOnlineUsers", onlineUsers);

    const pending = await NotificationModel.find({ to: userId, read: false });
    if (pending.length > 0) socket.emit("sendNotification", pending);

    socket.on("checkNotification", async ({ type, senderId }) => {
      await NotificationModel.deleteMany({
        type,
        from: senderId,
        to: userId,
        read: false,
      });
    });

    socket.on("acceptFriendRequest", async (friendId: string) => {
      try {
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
        await NotificationModel.create({
          type: "friend_request_accepted",
          to: friendId,
          from: userId,
          read: false,
        });
      } catch (error) {
        console.error(error);
      } finally {
        const friend = onlineUsers.find((u) => u.userId === friendId);
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

    socket.on("declineFriendRequest", async (friendId: string) => {});

    socket.on("addFriend", async (targetUserId: string) => {
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
        const targetUser = onlineUsers.find((u) => u.userId === targetUserId);
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

    socket.on("joinPrivateChat", async (targetUserId: string) => {
      try {
        conversation = await ConversationModel.findOne({
          participants: { $all: [userId, targetUserId], $size: 2 },
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
        }
      } catch (error) {
        console.error(error);
      } finally {
        const roomName = [userId, targetUserId].sort().join("--");
        socket.join(roomName);
      }
    });

    socket.on("sendPrivateMessage", async ({ targetUserId, message }) => {
      if (!conversation) return;
      const targetUser = onlineUsers.find((u) => u.userId === targetUserId);
      const roomName = [userId, targetUserId].sort().join("--");
      let payload = null;

      try {
        payload = await MessageModel.create({
          conversationId: new ObjectId(conversation._id),
          senderId: userId,
          messageType: "text",
          content: message,
        });
        await ConversationModel.updateOne(
          { _id: new ObjectId(conversation._id) },
          { $set: { lastMessage: payload } },
        );
        if (!targetUser) {
          await NotificationModel.create({
            type: "friend_message",
            to: targetUserId,
            from: userId,
            read: false,
          });
        }
      } catch (error) {
        console.error(error);
      } finally {
        if (!payload) return;
        io.to(roomName).emit("sendPrivateMessage", payload);
      }
    });

    socket.on("disconnect", () => {
      onlineUsers = onlineUsers.filter((u) => u.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("User disconnected:", username, userId);
    });
  });

  httpServer.listen(PORT, () => {
    console.log(`Socket server running on port ${PORT}`);
  });
}

main().catch(console.error);
