"use client";
import placeholder from "@/public/placeholder.png";
import { FaXmark } from "react-icons/fa6";
import { useState } from "react";
import { GiHamburgerMenu } from "react-icons/gi";
import { LuBicepsFlexed } from "react-icons/lu";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/utils/auth/AuthContext";
import { useChat } from "@/app/utils/chat/ChatContext";
import { FaBell } from "react-icons/fa";
import Image from "next/image";

export default function Header() {
  const router = useRouter();
  const { logout } = useAuth();
  const {
    users,
    notified,
    acceptFriendRequest,
    declineFriendRequest,
    checkNotification,
  } = useChat();
  const [showDropdownMenu, setShowDropdownMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header
      onMouseLeave={() => setShowDropdownMenu(false)}
      className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800"
    >
      <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <LuBicepsFlexed className="hidden sm:block text-2xl text-blue-500 font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text" />
          <h1 className="text-2xl font-black bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            FitTrack
          </h1>
        </div>

        {/* Desktop navigation */}
        <nav className="hidden md:flex items-center gap-1 sm:gap-3">
          <button
            onClick={() => router.push("/")}
            className="cursor-pointer px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors border border-indigo-200 dark:border-indigo-800"
          >
            Home
          </button>

          <button
            onClick={() => router.push("/friend")}
            className="cursor-pointer px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
          >
            Friend
          </button>

          <button
            onClick={() => router.push("/history")}
            className="cursor-pointer px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
          >
            History
          </button>

          <button
            onClick={() => router.push("/profile")}
            className="cursor-pointer px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
          >
            Profile
          </button>

          <button
            onClick={handleLogout}
            className="cursor-pointer px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors border border-red-200 dark:border-red-800"
          >
            Logout
          </button>

          {/* Notification bell */}
          <div
            className="relative cursor-pointer ml-4"
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <FaBell className="text-2xl" style={{ marginLeft: "auto" }} />
            {notified && notified.length !== 0 && (
              <div className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></div>
            )}
            {/* Notification box */}
            {showNotifications && notified.length !== 0 && (
              <div
                className="select-none bg-white dark:bg-slate-950/80 backdrop-blur-md rounded shadow-lg z-50 px-4 py-2"
                style={{
                  width: "full",
                  position: "absolute",
                  top: "50px",
                  right: "0px",
                }}
              >
                {notified?.map((n: any, id: any) => {
                  const user = users.find((user) => user.id === n.from);
                  if (n.type === "friend_request") {
                    return (
                      <div className="friendRequest" key={id}>
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} wants to be your friend
                        </span>
                        <button
                          onClick={() => acceptFriendRequest(user.id)}
                          className="acceptBtn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest(user.id)}
                          className="declineBtn"
                        >
                          Decline
                        </button>
                      </div>
                    );
                  } else if (n.type === "friend_request_accepted") {
                    return (
                      <div
                        className="friendRequest"
                        key={id}
                        onClick={() =>
                          checkNotification("friend_request_accepted", user.id)
                        }
                      >
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} accepted your friend request!
                        </span>
                      </div>
                    );
                  } else if (n.type === "friend_message") {
                    return (
                      <div
                        className="friendRequest"
                        key={id}
                        onClick={() =>
                          checkNotification("friend_message", user.id)
                        }
                      >
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} sent you a message!
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile navigation */}
        <nav className="md:hidden flex items-center gap-5">
          {showDropdownMenu ? (
            <FaXmark
              onClick={() => setShowDropdownMenu(false)}
              className="cursor-pointer text-2xl"
            />
          ) : (
            <GiHamburgerMenu
              onClick={() => setShowDropdownMenu(true)}
              className="cursor-pointer text-2xl"
            />
          )}

          <div
            className={`${showDropdownMenu ? "flex" : "hidden"} font-bold text-md fixed top-16 right-4 z-50 min-w-[50vw] bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800`}
          >
            <ul className="w-full">
              <li className="dropdown_item" onClick={() => router.push("/")}>
                Home
              </li>
              <li
                className="dropdown_item"
                onClick={() => router.push("/friend")}
              >
                Friend
              </li>
              <li
                className="dropdown_item"
                onClick={() => router.push("/history")}
              >
                History
              </li>
              <li
                className="dropdown_item"
                onClick={() => router.push("/profile")}
              >
                Profile
              </li>
              <li className="dropdown_item" onClick={handleLogout}>
                Logout
              </li>
            </ul>
          </div>

          {/* Notification bell mobile */}
          <div
            className="relative cursor-pointer "
            onClick={() => setShowNotifications((prev) => !prev)}
          >
            <FaBell className="text-2xl" style={{ marginLeft: "auto" }} />
            {notified && notified.length !== 0 && (
              <div className="absolute top-0 right-0 bg-red-500 w-2 h-2 rounded-full"></div>
            )}
            {/* Notification box */}
            {showNotifications && notified.length !== 0 && (
              <div
                className="select-none bg-white dark:bg-slate-950/80 backdrop-blur-md rounded shadow-lg z-50 px-4 py-2"
                style={{
                  width: "full",
                  position: "absolute",
                  top: "50px",
                  right: "0px",
                }}
              >
                {notified?.map((n: any, id: any) => {
                  const user = users.find((user) => user.id === n.from);
                  if (n.type === "friend_request") {
                    return (
                      <div className="friendRequest" key={id}>
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} wants to be your friend
                        </span>
                        <button
                          onClick={() => acceptFriendRequest(user.id)}
                          className="acceptBtn"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() => declineFriendRequest(user.id)}
                          className="declineBtn"
                        >
                          Decline
                        </button>
                      </div>
                    );
                  } else if (n.type === "friend_request_accepted") {
                    return (
                      <div
                        className="friendRequest"
                        key={id}
                        onClick={() =>
                          checkNotification("friend_request_accepted", user.id)
                        }
                      >
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} accepted your friend request!
                        </span>
                      </div>
                    );
                  } else if (n.type === "friend_message") {
                    return (
                      <div
                        className="friendRequest"
                        key={id}
                        onClick={() =>
                          checkNotification("friend_message", user.id)
                        }
                      >
                        <Image
                          src={user.profilePictureUrl || placeholder}
                          alt={`Picture of ${user.username}`}
                          width={100}
                          height={100}
                          className="rounded-full object-cover"
                          style={{ width: "30px", height: "30px" }}
                        />
                        <span className="w-50">
                          {user.username} sent you a message!
                        </span>
                      </div>
                    );
                  }
                })}
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
}
