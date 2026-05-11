'use client';

import { useState, useEffect } from 'react';
import { useAuth } from './utils/AuthContext';
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
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [stats, setStats] = useState<WorkoutStats | null>(null);
  const [showRegister, setShowRegister] = useState(false);
  const [loadingWorkouts, setLoadingWorkouts] = useState(false);

  // Fetch workouts from API when user is loaded
  useEffect(() => {
    if (user && !isLoading) {
      fetchWorkouts();
    }
  }, [user, isLoading]);

  // Update stats whenever workouts change
  useEffect(() => {
    setStats(calculateStats(workouts));
  }, [workouts]);

  const fetchWorkouts = async () => {
    try {
      setLoadingWorkouts(true);
      const response = await fetch('/api/workouts', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error('Failed to fetch workouts');
      }

      const data = await response.json();
      const mappedWorkouts: Workout[] = data.workouts.map((w: any) => ({
        id: w.id,
        name: w.name,
        type: w.type,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        intensity: w.intensity,
        date: new Date(w.date),
        notes: w.notes,
      }));
      setWorkouts(mappedWorkouts);
    } catch (error) {
      console.error('Error fetching workouts:', error);
      alert('Failed to load workouts');
    } finally {
      setLoadingWorkouts(false);
    }
  };

  const handleAddWorkout = async (newWorkout: Omit<Workout, 'id'>) => {
    try {
      const response = await fetch('/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(newWorkout),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create workout');
      }

      const data = await response.json();
      const createdWorkout: Workout = {
        id: data.workout.id,
        name: data.workout.name,
        type: data.workout.type,
        sets: data.workout.sets,
        reps: data.workout.reps,
        weight: data.workout.weight,
        intensity: data.workout.intensity,
        date: new Date(data.workout.date),
        notes: data.workout.notes,
      };
      setWorkouts([createdWorkout, ...workouts]);
    } catch (error) {
      console.error('Error creating workout:', error);
      alert(error instanceof Error ? error.message : 'Failed to create workout');
    }
  };

  const handleDeleteWorkout = async (id: string) => {
    if (confirm('Are you sure you want to delete this workout?')) {
      try {
        const response = await fetch(`/api/workouts/${id}`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Failed to delete workout');
        }

        setWorkouts(workouts.filter((w) => w.id !== id));
      } catch (error) {
        console.error('Error deleting workout:', error);
        alert(error instanceof Error ? error.message : 'Failed to delete workout');
      }
    }
  };

  const handleUpdateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      const response = await fetch(`/api/workouts/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(updates),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update workout');
      }

      const data = await response.json();
      const updatedWorkout: Workout = {
        id: data.workout.id,
        name: data.workout.name,
        type: data.workout.type,
        sets: data.workout.sets,
        reps: data.workout.reps,
        weight: data.workout.weight,
        intensity: data.workout.intensity,
        date: new Date(data.workout.date),
        notes: data.workout.notes,
      };
      setWorkouts(
        workouts.map((w) =>
          w.id === id ? updatedWorkout : w
        )
      );
    } catch (error) {
      console.error('Error updating workout:', error);
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
