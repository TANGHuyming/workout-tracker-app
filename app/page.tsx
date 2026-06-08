'use client';
import { useState, useEffect } from 'react';
import { useAuth } from './utils/auth/AuthContext';
import { useWorkouts } from './utils/workout/WorkoutContext';
import WorkoutForm from './components/WorkoutForm';
import BodyGraphics from './components/BodyGraphics';
import type { Workout } from './utils/workout/workoutData';
import { getAllExercises } from './utils/exercises';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Toast from './components/Toast';
import LoginRegister from './components/LoginRegister';
import { fetchCsrfToken } from './utils/csrf/fetchCsrfToken';

export default function Home() {
  const { user, isLoading } = useAuth();
  const { workouts, fetchWorkouts, addWorkout } = useWorkouts();
  const [showRegister, setShowRegister] = useState(false);
  const [exerciseName, setExerciseName] = useState('');
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' } | null>(null);
  const [showResetPassword, setShowResetPassword] = useState(false);
  const availableExercises = getAllExercises();
  ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: `Strength Progression of ${exerciseName}`,
      },
    },
  }
  const chartLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const [chartData, setChartData] = useState({
    labels: chartLabels,
    datasets: [
      {
        label: 'Weight (kg)',
        data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ]
  })

  // Fetch CSRF token
  useEffect(() => {
    fetchCsrfToken();
  }, []);

  // Fetch workouts from API when user is loaded
  useEffect(() => {
    if (user && !isLoading) {
      fetchWorkouts();
    }
  }, [user, isLoading]);

  // Update stats whenever workouts change
  useEffect(() => {
    handleSearchExercise();
  }, [exerciseName, workouts]);

  useEffect(() => {
    setTimeout(() => {
      setToast(null);
    }, 5000)
  }, [toast])

  const handleAddWorkout = async (newWorkout: Omit<Workout, 'id'>) => {
    try {
      await addWorkout(newWorkout);
      setToast({ message: 'Workout logged successfully!', type: 'success' });
      fetchWorkouts();
    } catch (error) {
      setToast({ message: 'Failed to create workout', type: 'error' });
    }
  };

  const handleSearchExercise = async () => {
    const filteredByExercise = workouts.filter((workout) => {
      return workout.name.toLowerCase().includes(exerciseName.toLowerCase());
    });

    const monthDatePair = filteredByExercise.map((workout) => {
      return {
        month: chartLabels[new Date(workout.date).getMonth()],
        weight: workout.weight
      }
    });

    const averageLifts = [];
    for (let i = 0; i < chartLabels.length; i++) {
      const filteredByMonth = monthDatePair.filter((workout) => {
        return workout.month === chartLabels[i];
      });
      const sumOfWeights = filteredByMonth.reduce((acc, w) => {
        return w.weight + acc;
      }, 0);

      const average = filteredByMonth.length !== 0 ? (sumOfWeights / filteredByMonth.length) : 0;
      averageLifts.push(average);
    }

    setChartData({
      labels: chartLabels,
      datasets: [
        {
          label: 'Weight (kg)',
          data: averageLifts,
          borderColor: 'rgb(255, 99, 132)',
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
        },
      ]
    })
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
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
          {/* Header */}
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

          <LoginRegister
            showRegister={showRegister}
            showResetPassword={showResetPassword}
            setShowRegister={setShowRegister}
            setShowResetPassword={setShowResetPassword}
          />
        </div>
      </div>
    );
  }

  // Show workout tracker if authenticated
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950">
      {
        toast && <Toast message={toast.message} type={toast.type} />
      }

      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-slate-900 dark:text-white mb-2">
            Welcome back, <span className="bg-linear-to-r from-blue-600 to-blue-500 dark:from-blue-400 dark:to-blue-300 bg-clip-text text-transparent">{user.username}</span>!
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-300 font-medium">
            Log your workouts and track your progress toward your fitness goals
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-1 gap-8 mb-10">
          <div>
            <WorkoutForm onAdd={handleAddWorkout} setToast={setToast} />
          </div>
        </div>

        <div className="mb-10">
          <div
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800"
          >
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                Exercise Progression
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">How your exercise is evolving</p>
            </div>

            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
              Exercise Name *
            </label>
            <select
              value={exerciseName}
              onChange={(e) => setExerciseName(e.target.value)}
              className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
            >
              <option value="">Select an exercise...</option>
              {availableExercises.map((exercise) => (
                <option key={exercise} value={exercise}>
                  {exercise}
                </option>
              ))}
            </select>

            {
              exerciseName ?
                <Line options={chartOptions} data={chartData} />
                :
                <div className="text-center py-12">
                  <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                    No exercise selected
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                    Try selecting an exercise to view its progression
                  </p>
                </div>
            }
          </div>
        </div>

        {/* Body Graphics Section */}
        <div className="mb-10">
          <BodyGraphics workouts={workouts} />
        </div>
      </div>
    </div>
  );
}
