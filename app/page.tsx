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
            <div className="text-right hidden sm:block">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Logged in as</p>
              <p className="font-semibold text-slate-900 dark:text-white">{user.username}</p>
            </div>
            <button
              onClick={() => logout()}
              className="px-4 py-2 bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400 font-semibold rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors border border-red-200 dark:border-red-800"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

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
    </div>
  );
}
