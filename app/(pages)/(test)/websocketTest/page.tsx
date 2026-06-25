"use client";
import { useEffect, useState } from "react";
import { useChat } from "@/app/utils/chat/ChatContext";
import { useAuth } from "@/app/utils/auth/AuthContext"

export default function WebsocketTestPage() {
  const { user, refreshUser } = useAuth();
  const { onlineUsers, privateMessages, notified, sendPrivateMessage, joinPrivateChat } = useChat();
  const [messageGroup, setMessageGroup] = useState<any>();
  const [targetUserId, setTargetUserId] = useState("");
  const [roomName, setRoomName] = useState("");
  const [text, setText] = useState("");

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    const grouped = Object.groupBy(privateMessages, (message) => {
      // If the message somehow lacks identifiers, fall back to a string
      if (!message.from || !message.to) return "unknown";

      // Recreate the consistent roomName: ["user1", "user2"].sort().join("--")
      return [message.from, message.to].sort().join("--");
    });

    setMessageGroup(grouped);
  }, [privateMessages]);

  useEffect(() => {
    console.log(notified);
  }, [notified])

  const handleRoomCreation = (userId: any, targetUserId: any) => {
    const newRoomName = [userId, targetUserId].sort().join("--")
    setTargetUserId(targetUserId);
    setRoomName(newRoomName);
    joinPrivateChat(newRoomName);
  }

  const handleSendMessage = (targetUserId: any, text: any) => {
    sendPrivateMessage(targetUserId, text);
    setText("");
  }

  return (
    <>
      <h3>FitTrack Instant Chat</h3>
      <div className="mb-6">
        <h2>Online Users: </h2>
        {
          onlineUsers &&
          onlineUsers.map((onlineUser: any, id: any) => {
            if (!user) return;
            if (user?.id === onlineUser.userId) return;
            return (
              <div key={id} onClick={() => handleRoomCreation(user.id, onlineUser.userId)}
                className="cursor-pointer flex flex-row justify-end items-center gap-2"
              >
                {notified?.isNotified && notified?.from === onlineUser.userId ? (
                  <div className="w-4 h-4 bg-red-500 rounded-full"
                  ></div>
                )
                  : (
                    null
                  )
                }
                <h3>{onlineUser.username}</h3>
              </div>
            )
          })
        }
      </div>

      <div className="mb-6">
        <h2>Your username: {user?.username}</h2>
        <input type="text" id="msg" placeholder="Type a message..." value={text} onChange={(e) => setText(e.target.value)} />
        <button onClick={() => handleSendMessage(targetUserId, text)}>Send</button>
      </div>

      <div id="chat">
        <h2>Chat: </h2>
        <div key={roomName} className="bg-slate-850 border-blue-950 border-2 rounded-lg">
          <div>Chatting with: {onlineUsers?.find((user: any) => user.userId === targetUserId)?.username}</div>
          {
            messageGroup?.[roomName]?.map((message: any, msgId: any) => (
              <div key={msgId}>
                {message.sender}: {message.message}
              </div>
            ))
          }
        </div>
      </div >
    </>
  );
}
