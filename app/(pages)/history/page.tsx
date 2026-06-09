"use client";
import Toast from "@/app/components/Toast";
import type { Workout } from "@/app/utils/workout/workoutData";
import WorkoutList from "@/app/components/WorkoutList";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [toast, setToast] = useState<{ message: string, type: 'success' | 'error' }>();
  const { workouts, fetchWorkouts, deleteWorkout, updateWorkout } = useWorkouts();

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
