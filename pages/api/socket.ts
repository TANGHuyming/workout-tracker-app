import { Server as SocketServer, Socket } from "socket.io";
import { connectDB } from "@/app/lib/mongodb";
import NotificationModel from "@/app/models/Notification";
import UserModel from "@/app/models/User";
import ConversationModel from "@/app/models/Conversation";
import MessageModel from "@/app/models/Message";
import mongoose from "mongoose";
import { NextApiRequest, NextApiResponse } from "next";
import { Server as NetServer } from "http";

type NextApiResponseWithSocket = NextApiResponse & {
  socket: {
    server: NetServer & {
      io?: SocketServer;
    };
  };
};

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(
  request: NextApiRequest,
  response: NextApiResponseWithSocket,
) {
  if (response.socket.server.io) {
    console.log("Socket.io server is already running");
    response.end();
    return;
  }

  await connectDB();
  const { ObjectId } = mongoose.Types;
  const io = new SocketServer(response.socket.server, {
    path: "/api/socket",
    addTrailingSlash: false,
    cors: {
      origin: process.env.NEXT_PUBLIC_API_URL,
      methods: ["GET", "POST"],
    },
  });

  response.socket.server.io = io;

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

    socket.on(
      "checkNotification",
      async ({ type, senderId }: { type: string; senderId: any }) => {
        await NotificationModel.deleteMany({
          type: type,
          from: senderId,
          to: userId,
          read: false,
        });
      },
    );

    socket.on("acceptFriendRequest", async (friendId: any) => {
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

    socket.on("declineFriendRequest", async (friendId: any) => {});

    socket.on("addFriend", async (targetUserId: any) => {
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

    socket.on("sendPrivateMessage", async ({ targetUserId, message }) => {
      if (!conversation) return;

      const targetUser = onlineUsers.find(
        (user) => user.userId === targetUserId,
      );
      const roomName = [userId, targetUserId].sort().join("--");
      let payload = null;

      try {
        // Store message in DB
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
      onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
      io.emit("getOnlineUsers", onlineUsers);
      console.log("User disconnected: ", username, ": ", userId);
    });
  });

  response.end();
}
