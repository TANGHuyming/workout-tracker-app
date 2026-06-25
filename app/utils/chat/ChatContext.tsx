"use client";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useAuth } from "@/app/utils/auth/AuthContext";

import io from "socket.io-client";

interface ChatContextType {
  user: any;
  users: any[];
  socket: any;
  onlineUsers: any;
  privateMessages: any[];
  notified: any[];
  sendPrivateMessage: (targetUserId: any, message: any) => void;
  joinPrivateChat: (targetUserId: any) => void;
  addFriend: (targetUserId: any) => void;
  acceptFriendRequest: (friendId: any) => void;
  declineFriendRequest: (friendId: any) => void;
  checkNotification: (type: string, senderId: any) => void;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export function ChatProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth();
  const [users, setUsers] = useState<any>([]);
  const [socket, setSocket] = useState<any>(null);
  const [onlineUsers, setOnlineUsers] = useState<any>(null);
  const [privateMessages, setPrivateMessages] = useState<any[]>([]);
  const [notified, setNotified] = useState<any[]>([]);

  useEffect(() => {
    const socketInitializer = async () => {
      if (!user) return; // Only connect if user is logged in

      getUsers();

      await fetch("/api/socket");

      const socketInstance = io(
        process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000",
        {
          path: "/api/socket",

          auth: {
            username: user.username,
            userId: user.id,
          },
        },
      );

      setSocket(socketInstance);

      // Setup global listeners
      socketInstance.on("getOnlineUsers", (users: any) => {
        setOnlineUsers(users);
      });

      socketInstance.on("sendPrivateMessage", (payload: any) => {
        // console.log(payload);
        setPrivateMessages((prev) => [...prev, payload]);
      });

      socketInstance.on("pastMessages", (payload: any) => {
        // console.log(payload);
        setPrivateMessages(payload);
      });

      socketInstance.on("sendNotification", (payload: any) => {
        setNotified((prev: any) => [...prev, ...payload]);
      });

      // Cleanup on unmount or user change
      return () => {
        socketInstance.off("getOnlineUsers");
        socketInstance.off("pastMessages");
        socketInstance.off("sendNotification");
        socketInstance.off("pendingNotifications");
        socketInstance.off("friendRequeset");
        socketInstance.disconnect();
        setSocket(null);
      };
    };

    socketInitializer();
  }, [user?.id]); // Only re-run if the actual user ID changes

  const joinPrivateChat = (targetUserId: any) => {
    if (!socket) return;
    setPrivateMessages([]);
    socket.emit("joinPrivateChat", targetUserId);
  };

  const sendPrivateMessage = (targetUserId: any, message: any) => {
    if (!socket) return;
    const payload = { targetUserId, message };
    socket.emit("sendPrivateMessage", payload);
  };

  const addFriend = async (targetUserId: any) => {
    socket.emit("addFriend", targetUserId);
  };

  const getUsers = async () => {
    try {
      const response = await fetch("/api/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      setUsers(undefined);
    }
  };

  const acceptFriendRequest = (friendId: any) => {
    socket.emit("checkNotification", {
      type: "friend_request_accepted",
      senderId: friendId,
    });
    socket.emit("acceptFriendRequest", friendId);
    setNotified((prev) => prev.filter((p) => p.from !== friendId));
  };

  const declineFriendRequest = (friendId: any) => {
    socket.emit("checkNotification", {
      type: "friend_request_declined", // can't think of a name for this yet
      senderId: friendId,
    });
    socket.emit("declineFriendRequest", friendId);
    setNotified((prev) => prev.filter((p) => p.from !== friendId));
  };

  const checkNotification = (type: string, senderId: any) => {
    socket.emit("checkNotification", { type, senderId });
    setNotified((prev) => prev.filter((p) => p.from !== senderId));
  };

  return (
    <ChatContext.Provider
      value={{
        user,
        users,
        socket,
        onlineUsers,
        privateMessages,
        notified,
        sendPrivateMessage,
        joinPrivateChat,
        addFriend,
        acceptFriendRequest,
        declineFriendRequest,
        checkNotification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
}

export function useChat() {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
}
