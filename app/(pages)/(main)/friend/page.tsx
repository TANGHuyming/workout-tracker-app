"use client";
import { useChat } from "@/app/utils/chat/ChatContext";
import { useAuth } from "@/app/utils/auth/AuthContext";
import { useEffect, useState } from "react";
import Image from "next/image";
import placeholder from "@/public/placeholder.png";
import { IoIosSend } from "react-icons/io";

export default function FriendPage() {
  const { users, sendPrivateMessage, privateMessages, joinPrivateChat } =
    useChat();
  const { user, refreshUser } = useAuth();
  const [friends, setFriends] = useState<any[]>([]);
  const [message, setMessage] = useState("");
  const [targetUserId, setTargetUserId] = useState("");

  useEffect(() => {
    refreshUser();
  }, []);

  useEffect(() => {
    if (!users || !user) return;
    const friendIds = user.friends;
    friendIds.forEach((id) => {
      const friendData = users.find((u) => u.id === id);
      if (!friendData || friendData.id === user.id) return null;
      setFriends((prev) => [...prev, friendData]);
    });

    return () => {
      setFriends([]);
    };
  }, [user, users]);

  useEffect(() => {
    if (!user || targetUserId.length === 0) return;
    joinPrivateChat(targetUserId);
  }, [targetUserId]);

  return (
    <div className="pageContainer">
      <div className="mainContent">
        {/* List of friends to chat to */}
        <div
          id="friendList"
          className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
        >
          <span> List of online friends: </span>
          {friends.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-3 ">
              {friends?.map((f: any, id: any) => (
                <div
                  className="px-4 py-2 flex flex-row items-center gap-4 dark:hover:bg-slate-800 cursor-pointer"
                  key={id}
                  onClick={() => setTargetUserId(f.id)}
                >
                  <Image
                    src={f.profilePictureUrl ?? placeholder}
                    alt={`picture of ${f.username}`}
                    width={50}
                    height={50}
                    className="rounded-full object-cover"
                    style={{
                      width: "24px",
                      height: "24px",
                    }}
                  />
                  <span className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    {f.username}
                  </span>
                </div>
              ))}
            </div>
          ) : null}
        </div>

        {/* Displaying who you are chatting to */}
        <h2 className={`${targetUserId.length === 0 ? "hidden" : "block"}`}>
          Chatting with: {friends.find((f) => f.id === targetUserId)?.username}
        </h2>

        {/* Chat box */}
        <div
          id="chatBox"
          className="bg-white dark:bg-slate-900 p-4 sm:p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
        >
          {privateMessages.length !== 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 row-start-1 gap-y-2 w-full mb-5 max-h-[50vh] overflow-y-auto">
              {privateMessages.map((msg: any, id: any) => {
                const person = users.find((u) => u.id === msg.senderId);
                const profilePictureUrl = person?.profilePictureUrl;
                const username = person?.username;
                if (msg.senderId === user?.id) {
                  return (
                    <div
                      key={id}
                      className="sm:col-start-2 col-span-full justify-self-end flex flex-row items-center gap-2 "
                    >
                      <span className="px-4 py-2 bg-blue-200 dark:bg-blue-800 rounded-md">
                        {msg.content}
                      </span>
                      <Image
                        src={profilePictureUrl ?? placeholder}
                        alt={`picture of ${username}`}
                        width={50}
                        height={50}
                        className="hidden sm:block rounded-full object-cover "
                        style={{ width: "24px", height: "24px" }}
                      />
                    </div>
                  );
                } else {
                  return (
                    <div
                      key={id}
                      className="col-span-full sm:col-start-1 justify-self-start flex flex-row items-center gap-2 "
                    >
                      <Image
                        src={profilePictureUrl ?? placeholder}
                        alt={`picture of ${username}`}
                        width={50}
                        height={50}
                        className="hidden sm:block rounded-full object-cover "
                        style={{ width: "24px", height: "24px" }}
                      />
                      <span className="px-4 py-2 bg-purple-200 dark:bg-purple-800 rounded-md">
                        {msg.content}
                      </span>
                    </div>
                  );
                }
              })}
            </div>
          ) : null}

          {/* Text box and send */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              sendPrivateMessage(targetUserId, message);
              setMessage("");
            }}
            className="flex flex-row justify-between items-center row-start-2 col-span-2 gap-5"
          >
            <input
              type="text"
              placeholder="Enter a message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="inputField"
            />
            <button type="submit" className="cursor-pointer">
              <IoIosSend className="text-2xl" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
