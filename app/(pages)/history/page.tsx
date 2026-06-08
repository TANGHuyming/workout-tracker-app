"use client";
import Toast from "@/app/components/Toast";
import type { Workout } from "@/app/utils/workout/workoutData";
import WorkoutList from "@/app/components/WorkoutList";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' }>();
  const [loadingWorkouts, setLoadingWorkouts] = useState(true);
  const { workouts, fetchWorkouts, deleteWorkout, updateWorkout } = useWorkouts();

  useEffect(() => {
    const fetching = async () => {
      try {
        await fetchWorkouts();
      }
      catch (e) {
        setToast({ message: "Fetching workout failed!", type: 'error' });
        setLoadingWorkouts(false);
      }
      finally {
        setLoadingWorkouts(false);
      }
    }
    fetching();
  }, [])

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
      fetchWorkouts();
    } catch (error) {
      setToast({ message: "Deleting workout failed!", type: 'error' });
    }
    finally {
      setToast({ message: "Deleting workout successful!", type: 'success' });
    }
  };

  const handleUpdateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      await updateWorkout(id, updates);
      fetchWorkouts();
    } catch (error) {
      setToast({ message: "Updating workout failed!", type: 'error' });
    }
    finally {
      setToast({ message: "Updating workout successful!", type: 'success' });
    }
  };

  return (
    loadingWorkouts ? (
      <div className="text-center py-12" >
        <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
        <p className="text-lg font-medium text-slate-600 dark:text-slate-300">Loading your workouts...</p>
      </div>
    ) : (
      <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {toast ? <Toast message={toast.message} type={toast.type} /> : <div></div>}
        <WorkoutList
          workouts={workouts}
          onDelete={handleDeleteWorkout}
          onUpdate={handleUpdateWorkout}
        />
      </div>
    ));
}
