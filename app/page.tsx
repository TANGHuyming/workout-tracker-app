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
  const { user, isLoading, logout } = useAuth();
  const { workouts, isLoading: loadingWorkouts, error, fetchWorkouts, addWorkout, updateWorkout, deleteWorkout } = useWorkouts();
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [showRegister, setShowRegister] = useState(false);

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

  if (isLoading) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login/register if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-zinc-50 dark:bg-black">
        <div className="max-w-md mx-auto px-4 py-16">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-black dark:text-white mb-2">
              💪 Workout Tracker
            </h1>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">
              Track your workouts and monitor progress
            </p>
          </div>

          <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
            {showRegister ? (
              <>
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
                  Create Account
                </h2>
                <RegisterForm
                  onSuccess={() => {
                    setShowRegister(false);
                  }}
                />
                <button
                  onClick={() => setShowRegister(false)}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2"
                >
                  Already have an account? Login
                </button>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white text-center">
                  Welcome Back
                </h2>
                <LoginForm onSuccess={() => {}} />
                <button
                  onClick={() => setShowRegister(true)}
                  className="w-full mt-4 text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium py-2"
                >
                  Don't have an account? Register
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show workout tracker if authenticated
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-black">
      {/* Header with user info and logout */}
      <div className="bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
        <div className="max-w-6xl mx-auto px-4 py-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-black dark:text-white">💪 Workout Tracker</h1>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-sm text-zinc-600 dark:text-zinc-400">Logged in as</p>
              <p className="font-semibold text-black dark:text-white">{user.username}</p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-md transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-black dark:text-white mb-2">
            Welcome back, {user.username}! 🏋️
          </h2>
          <p className="text-lg text-zinc-600 dark:text-zinc-400">
            Log your workouts and track your fitness progress
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
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
        <div className="mb-8">
          <BodyGraphics workouts={workouts} />
        </div>

        {/* Workout History */}
        {loadingWorkouts ? (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-zinc-600 dark:text-zinc-400">Loading workouts...</p>
          </div>
        ) : (
          <WorkoutList
            workouts={workouts}
            onDelete={handleDeleteWorkout}
            onUpdate={handleUpdateWorkout}
          />
        )}
      </div>
    </div>
  );
}
