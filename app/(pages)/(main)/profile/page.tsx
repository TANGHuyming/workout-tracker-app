"use client";
import Image from "next/image";
import Toast from "@/app/components/Toast";
import { fetchCsrfToken } from "@/app/utils/csrf/fetchCsrfToken";
import { useEffect, useState } from "react";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useAuth } from "@/app/utils/auth/AuthContext";
import { useChat } from "@/app/utils/chat/ChatContext";
import { useRouter } from "next/navigation";
import StatsBreakdown from "@/app/components/StatsBreakdown";
import placeholder from "@/public/placeholder.png";

export default function ProfilePage() {
  const { user, refreshUser, logout } = useAuth();
  const { users, addFriend } = useChat();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [searchFriend, setSearchFriend] = useState("");
  const [searchedUsers, setSearchedUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();
  const { workoutStats, fetchWorkoutStats } = useWorkouts();

  useEffect(() => {
    const fetcher = async () => {
      try {
        await fetchWorkoutStats();
      } catch (err) {
        setToast({
          message:
            err instanceof Error ? err.message : "Failed to fetch workouts",
          type: "error",
        });
      }
    };

    refreshUser();
    fetcher();
    fetchCsrfToken();
  }, []);

  useEffect(() => {
    setIsLoading(true);
    const handleSearch = async (searchFriend: any) => {
      try {
        const response = await fetch(
          `/api/users?searchFriend=${searchFriend}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          },
        );

        if (!response.ok) {
          throw new Error("Error when searching for a friend");
        }

        const data = await response.json();
        setSearchedUsers(data.users);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    const searchTimeout: any = setTimeout(() => {
      handleSearch(searchFriend);
    }, 1000);

    return () => {
      clearTimeout(searchTimeout);
    };
  }, [searchFriend]);

  const handleSaveProfile = async (e: any) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    setSavingProfile(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to update profile");
      }

      setToast({ message: "Profile updated successfully", type: "success" });

      if (user && user.email !== profileForm.email) {
        logout();
        return router.push("/login");
      }

      setEditingProfile(false);
      refreshUser();
    } catch (error) {
      setToast({
        message:
          error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {toast ? (
        <Toast message={toast.message} type={toast.type} />
      ) : (
        <div></div>
      )}

      {/* Hero Section */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
          Your Profile
        </h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
          Manage your account details
        </p>
      </div>

      {/* Profile Edit Form */}
      <div className="w-full space-y-6">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Account Information
            </h3>
          </div>

          <div className="mb-6">
            <h3>Add a friend</h3>
            <input
              id="searchFriend"
              name="searchFriend"
              value={searchFriend}
              onChange={(e) => setSearchFriend(e.target.value)}
              className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
            />
            {searchFriend.length !== 0 && (
              <div>
                <span>User(s) found: {searchFriend}</span>
                {searchedUsers.length === 0 ? (
                  <div className="w-full bg-slate-50 dark:bg-slate-800 p-4 backdrop-blur-md">
                    No User Found
                  </div>
                ) : (
                  <div className="relative w-full">
                    <div className="w-full absolute top-0 left-0 bg-slate-50 dark:bg-slate-800 backdrop-blur-md">
                      {isLoading ? (
                        <div className="flex flex-row gap-y-4 animate-pulse p-4 gap-4 items-center">
                          <div className="rounded-full bg-slate-50 dark:bg-slate-700 w-8 h-8 p-3"></div>
                          <span className="rounded-lg bg-slate-50 dark:bg-slate-700 w-full p-2"></span>
                        </div>
                      ) : (
                        <div>
                          {searchedUsers.map((searchUser, id) => {
                            if (searchUser.friends?.includes(user?.id)) {
                              return null;
                            }
                            if (searchUser.id === user?.id) {
                              return null;
                            }
                            return (
                              <div
                                key={id}
                                className="flex flex-row items-center gap-4 p-4 cursor-pointer hover:bg-slate-300 dark:hover:bg-slate-600"
                                onClick={() => addFriend(searchUser.id)}
                              >
                                <Image
                                  src={
                                    searchUser.profilePictureUrl || placeholder
                                  }
                                  alt={`Picture of ${searchUser.username}`}
                                  width={100}
                                  height={100}
                                  className="rounded-full object-cover"
                                  style={{ width: "32px", height: "32px" }}
                                  loading="lazy"
                                />
                                <span>{searchUser.username}</span>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {!editingProfile ? (
            <div>
              {!user ? (
                // Profile loading skeleton
                <div className="flex flex-col gap-y-4 animate-pulse">
                  <label className="p-4 bg-slate-50 dark:bg-slate-800 mb-2 w-1/3"></label>
                  <div className="p-10 rounded-full bg-slate-50 dark:bg-slate-800 mb-2 w-40 h-40"></div>
                  <label className="p-4 bg-slate-50 dark:bg-slate-800 mb-2 w-1/3"></label>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"></div>
                  <label className="p-4 bg-slate-50 dark:bg-slate-800 mb-2 w-1/3"></label>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700"></div>
                  <label className="p-4 bg-slate-50 dark:bg-slate-800 mb-2 w-1/3"></label>
                  <div className="p-6 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 "></div>
                </div>
              ) : (
                // Account content
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Profile Picture
                    </label>
                    <Image
                      src={
                        user.profilePictureUrl
                          ? user.profilePictureUrl
                          : placeholder
                      }
                      alt={`${user.username}'s profile picture`}
                      width={500}
                      height={500}
                      className="w-40 h-40 rounded-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Username
                    </label>
                    <p className="text-md sm:text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Email
                    </label>
                    <p className="text-md sm:text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.email || "Not provided"}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                      Member Since
                    </label>
                    <p className="text-md sm:text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.createdAt
                        ? new Date(user.createdAt).toLocaleDateString("en-US", {
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })
                        : "N/A"}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      setEditingProfile(true);
                      setProfileForm({
                        username: user?.username || "",
                        email: user?.email || "",
                      });
                    }}
                    className="cursor-pointer w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border border-blue-700 dark:border-blue-600"
                  >
                    Edit Profile
                  </button>
                </div>
              )}
            </div>
          ) : (
            <form
              onSubmit={handleSaveProfile}
              enc-type="multipart/form-data"
              className="space-y-6"
            >
              {/* Edit Mode */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Profile Picture
                </label>
                <input
                  type="file"
                  id="profilePicuture"
                  name="profilePicture"
                  required
                  accept="image/jpeg, image/jpg, image/png"
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, username: e.target.value })
                  }
                  id="username"
                  name="username"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter username"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                  id="email"
                  name="email"
                  required
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter email"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  disabled={savingProfile}
                  className="cursor-pointer flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
                <button
                  type="button"
                  onClick={() => setEditingProfile(false)}
                  disabled={savingProfile}
                  className="cursor-pointer flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {!workoutStats ? (
          <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Loading your workouts...
            </p>
          </div>
        ) : (
          <div className="lg:col-span-2">
            {workoutStats && <StatsBreakdown stats={workoutStats} />}
          </div>
        )}
      </div>
    </div>
  );
}
