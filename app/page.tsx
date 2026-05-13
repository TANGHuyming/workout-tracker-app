'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './utils/AuthContext';
import { useWorkouts } from './utils/WorkoutContext';
import WorkoutForm from './components/WorkoutForm';
import WorkoutList from './components/WorkoutList';
import StatsBreakdown from './components/StatsBreakdown';
import BodyGraphics from './components/BodyGraphics';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { calculateStats } from './utils/workoutData';
import type { Workout, WorkoutStats } from './utils/workoutData';

export default function Home() {
  const { user, isLoading, logout, refreshUser } = useAuth();
  const { workouts, isLoading: loadingWorkouts, error, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  const [profileForm, setProfileForm] = useState({ username: user?.username || '', email: user?.email || '' });
  const [savingProfile, setSavingProfile] = useState(false);

  // Fetch workouts from API when user is loaded
  useEffect(() => {
    if (user && !isLoading) {
      fetchWorkouts();
    }
  }, [user, isLoading, fetchWorkouts]);

  // Update stats whenever workouts change
  useEffect(() => {
    setStats(calculateStats(workouts));
  }, [workouts]);

  const handleAddWorkout = async (newWorkout: Omit<Workout, 'id'>) => {
    try {
      await addWorkout(newWorkout);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to create workout');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        await deleteWorkout(id);
      } catch (error) {
        alert(error instanceof Error ? error.message : 'Failed to delete workout');
      }
    }
  };

  const handleUpdateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      await updateWorkout(id, updates);
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update workout');
    }
  };

  const handleSaveProfile = async () => {
    setSavingProfile(true);
    try {
      const response = await fetch('/api/users/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: profileForm.username,
          email: profileForm.email,
        }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update profile');
      }
      
      alert('Profile updated successfully!');
      setEditingProfile(false);
      refreshUser();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'Failed to update profile');
    } finally {
      setSavingProfile(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading your workouts...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-md">
          <div className="text-center mb-10">
            <div className="mb-6">
              <h1 className="text-5xl font-black bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent mb-2">
                💪 FitTrack
              </h1>
            </div>
            <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
              Track your workouts and reach your goals
            </p>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
            {showRegister ? (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                    Create Account
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Join the fitness revolution</p>
                </div>
                <div className="p-6">
                  <RegisterForm
                    onSuccess={() => {
                      setShowRegister(false);
                    }}
                  />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                  <button
                    onClick={() => setShowRegister(false)}
                    className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                  >
                    Already have an account? Login
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 p-6 border-b border-slate-200 dark:border-slate-800">
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white text-center">
                    Welcome Back
                  </h2>
                  <p className="text-sm text-slate-600 dark:text-slate-400 text-center mt-1">Continue your fitness journey</p>
                </div>
                <div className="p-6">
                  <LoginForm onSuccess={() => {}} />
                </div>
                <div className="border-t border-slate-200 dark:border-slate-800 p-4">
                  <button
                    onClick={() => setShowRegister(true)}
                    className="w-full text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2 transition-colors"
                  >
                    Don't have an account? Register
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show workout tracker if authenticated
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {/* Header with user info and logout */}
      <header className="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-black bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">
            💪 FitTrack
          </h1>
          <div className="flex items-center gap-6">
            {
              !showProfile ?
              <button
                onClick={() => setShowProfile(true)}
                className="px-4 py-2 bg-blue-50 dark:bg-blue-950 text-blue-600 dark:text-blue-400 font-semibold rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors border border-blue-200 dark:border-blue-800"
              >
                Profile
              </button>
              :
              <button
                onClick={() => setShowProfile(false)}
                className="px-4 py-2 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 font-semibold rounded-lg hover:bg-indigo-100 dark:hover:bg-indigo-900 transition-colors border border-indigo-200 dark:border-indigo-800"
              >
                Home
              </button>
            }
            
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors border border-red-200 dark:border-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>
      
      {
        showProfile ?
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
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
          <div className="max-w-2xl">
            <div className="p-8 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 overflow-hidden">
              <div className="mb-8">
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Account Information</h3>
              </div>
              
              {!editingProfile ? (
                <div className="space-y-6">
                  {/* Display Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Username</label>
                    <p className="text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.username}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Email</label>
                    <p className="text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.email || 'Not provided'}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Member Since</label>
                    <p className="text-lg font-medium text-slate-900 dark:text-white px-4 py-3 bg-slate-50 dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                    </p>
                  </div>
                  
                  <button
                    onClick={() => {
                      setEditingProfile(true);
                      setProfileForm({ username: user?.username || '', email: user?.email || '' });
                    }}
                    className="w-full px-6 py-3 bg-blue-600 dark:bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-700 dark:hover:bg-blue-600 transition-colors border border-blue-700 dark:border-blue-600"
                  >
                    Edit Profile
                  </button>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Edit Mode */}
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Username</label>
                    <input
                      type="text"
                      value={profileForm.username}
                      onChange={(e) => setProfileForm({ ...profileForm, username: e.target.value })}
                      className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white rounded-lg border border-slate-200 dark:border-slate-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-colors"
                      placeholder="Enter username"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-600 dark:text-slate-400 mb-2">Email</label>
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
                      className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold rounded-lg transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {savingProfile ? 'Saving...' : 'Save Changes'}
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
        :
        <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
          {/* Hero Section */}
          <div className="mb-10">
            <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
              Welcome back, <span className="bg-gradient-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{user.username}</span>! 🏋️
            </h2>
            <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
              Log your workouts and track your progress toward your fitness goals
            </p>
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-10">
            {/* Left Column - Form */}
            <div className="lg:col-span-1">
              <WorkoutForm onAdd={handleAddWorkout} />
            </div>

            {/* Right Column - Stats */}
            <div className="lg:col-span-2">
              {stats && <StatsBreakdown stats={stats} />}
            </div>
          </div>

          {/* Body Graphics Section */}
          <div className="mb-10">
            <BodyGraphics workouts={workouts} />
          </div>

          {/* Workout History */}
          {loadingWorkouts ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading your workouts...</p>
            </div>
          ) : (
            <WorkoutList
              workouts={workouts}
              onDelete={handleDeleteWorkout}
              onUpdate={handleUpdateWorkout}
            />
          )}
        </div>
      }
    </div>
  );
}
