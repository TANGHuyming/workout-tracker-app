"use client";
import Toast from "@/app/components/Toast";
import { fetchCsrfToken } from "@/app/utils/csrf/fetchCsrfToken";
import { useEffect, useState } from "react";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useAuth } from "@/app/utils/auth/AuthContext";
import { useRouter } from "next/navigation";
import type { WorkoutStats } from "@/app/utils/workout/workoutData";
import { calculateStats } from "@/app/utils/workout/workoutData";
import StatsBreakdown from "@/app/components/StatsBreakdown";

export default function ProfilePage() {
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const { user, refreshUser, logout } = useAuth();
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({
    username: user?.username || "",
    email: user?.email || "",
  });
  const [savingProfile, setSavingProfile] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const router = useRouter();
  const { workouts, fetchWorkouts } = useWorkouts();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        await fetchWorkouts();
      } catch (err) {
        setToast({
          message: err instanceof Error ? err.message : "Failed to fetch workouts",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (workouts.length === 0) {
      fetcher();
    }

    fetchCsrfToken();
    setIsLoading(false);
  }, []);

  useEffect(() => {
    setStats(calculateStats(workouts));
  }, [workouts]);

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch("/api/users/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: profileForm.username,
          email: profileForm.email,
        }),
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
        message: error instanceof Error ? error.message : "Failed to update profile",
        type: "error",
      });
    } finally {
      setSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
          Loading your workouts...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {toast ? <Toast message={toast.message} type={toast.type} /> : <div></div>}

      {/* Hero Section */}
      <div className="mb-10">
        <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">Your Profile</h2>
        <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
          Manage your account details
        </p>
      </div>

      {/* Profile Edit Form */}
      <div className="w-full">
        <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
          <div className="mb-8">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-white">
              Account Information
            </h3>
          </div>

          {!editingProfile ? (
            <div className="space-y-6">
              {/* Display Mode */}
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
                  setProfileForm({ username: user?.username || "", email: user?.email || "" });
                }}
                className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border border-blue-700 dark:border-blue-600"
              >
                Edit Profile
              </button>

              <div className="lg:col-span-2">{stats && <StatsBreakdown stats={stats} />}</div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Edit Mode */}
              <div>
                <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">
                  Username
                </label>
                <input
                  type="text"
                  value={profileForm.username}
                  onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
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
                  onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                  placeholder="Enter email"
                />
              </div>

              <div className="flex gap-4">
                <button
                  onClick={handleSaveProfile}
                  disabled={savingProfile}
                  className="flex-1 px-6 py-3 bg-linear-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {savingProfile ? "Saving..." : "Save Changes"}
                </button>
                <button
                  onClick={() => setEditingProfile(false)}
                  disabled={savingProfile}
                  className="flex-1 px-6 py-3 bg-slate-200 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold rounded-lg hover:bg-slate-300 dark:hover:bg-slate-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
