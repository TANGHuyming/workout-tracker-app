"use client";
import Toast from "@/app/components/Toast";
import type { Workout } from "@/app/utils/workout/workoutData";
import WorkoutList from "@/app/components/WorkoutList";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { workouts, fetchWorkouts, fetchWorkoutsByDate, deleteWorkout, updateWorkout } =
    useWorkouts();

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        await fetchWorkoutsByDate(new Date());
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

    setIsLoading(false);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  const handleDeleteWorkout = async (id: string) => {
    try {
      await deleteWorkout(id);
    } catch (error) {
      setToast({ message: "Deleting workout failed!", type: "error" });
    } finally {
      setToast({ message: "Deleting workout successful!", type: "success" });
    }
  };

  const handleUpdateWorkout = async (id: string, updates: Partial<Workout>) => {
    try {
      await updateWorkout(id, updates);
    } catch (error) {
      setToast({ message: "Updating workout failed!", type: "error" });
    } finally {
      setToast({ message: "Updating workout successful!", type: "success" });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-linear-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-blue-950 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
            Loading your workouts...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {toast ? <Toast message={toast.message} type={toast.type} /> : <div></div>}
      <WorkoutList
        workouts={workouts}
        onDelete={handleDeleteWorkout}
        onUpdate={handleUpdateWorkout}
      />
    </div>
  );
}
