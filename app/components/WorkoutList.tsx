"use client";

import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Workout } from "../utils/workout/workoutData";
import WorkoutCard from "./WorkoutCard";
import WorkoutEditModal from "./WorkoutEditModal";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { LuLayoutGrid } from "react-icons/lu";

interface WorkoutListProps {
  workouts: Workout[];
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Workout>) => Promise<void>;
}

export default function WorkoutList({
  workouts,
  onDelete,
  onUpdate,
}: WorkoutListProps) {
  const { fetchWorkoutsByAll, isLoading } = useWorkouts();
  const [searchExercise, setSearchExercise] = useState<string>("");
  const [searchDate, setSearchDate] = useState<string>(
    new Date().toISOString().split("T")[0],
  );
  const [searchWeight, setSearchWeight] = useState<string>("");
  const [sortBy, setSortBy] = useState<"date" | "weight" | "sets">("date");
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [index, setIndex] = useState<number>(0);
  const [layout, setLayout] = useState({ isCompact: false, isVertical: false });

  const filterByAll = async () => {
    try {
      await fetchWorkoutsByAll(
        new Date(searchDate.length !== 0 ? searchDate : 0),
        searchExercise,
        parseFloat(searchWeight),
      );
      setSearchExercise("");
      setSearchDate("");
      setSearchWeight("");
    } catch (error) {
      console.error(error);
    }
  };

  const sortedWorkouts = [...workouts].sort((a, b) => {
    switch (sortBy) {
      case "weight":
        return b.weight - a.weight;
      case "sets":
        return b.sets - a.sets;
      case "date":
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      default:
        return new Date(b.date).getTime() - new Date(a.date).getTime();
    }
  });

  const handleEdit = (workout: Workout) => {
    setEditingWorkout(workout);
  };

  const handleCloseModal = () => {
    setEditingWorkout(null);
  };

  const handleSaveWorkout = async (id: string, updates: Partial<Workout>) => {
    if (onUpdate) {
      await onUpdate(id, updates);
      handleCloseModal();
    }
  };

  const handleChangeCardLayout = () => {
    const layouts = ["full", "compact"];
    setIndex((prev) => (prev + 1) % layouts.length);

    if (layouts[index] === "full") {
      setLayout({ isCompact: false, isVertical: false });
    } else if (layouts[index] === "compact") {
      setLayout({ isCompact: true, isVertical: false });
    }
  };

  return (
    <>
      <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Workout History
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Search and filter your logged workouts
          </p>
        </div>

        {/* Search and Sort */}
        <div className="space-y-6 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
          {/* Search Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Exercise
              </label>
              <input
                type="text"
                value={searchExercise}
                onChange={(e) => setSearchExercise(e.target.value)}
                placeholder="e.g., Bench Press"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Date
              </label>
              <input
                type="date"
                value={searchDate}
                onChange={(e) => setSearchDate(e.target.value)}
                className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <div className="flex flex-col gap-2">
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                Min Weight (kg)
              </label>
              <input
                type="number"
                value={searchWeight}
                onChange={(e) => setSearchWeight(e.target.value)}
                placeholder="e.g., 100"
                min="0"
                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
              />
            </div>

            <button
              type="button"
              onClick={filterByAll}
              className={clsx(
                "border-blue-50 py-2 px-4 text-sm rounded-lg w-full sm:w-1/2",
                isLoading ? "bg-blue-950/50" : "bg-blue-950",
              )}
              disabled={isLoading}
            >
              {isLoading ? "Applying..." : "Apply filters"}
            </button>
          </div>

          {/* Sort */}
          <div>
            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
              Sort By
            </label>
            <select
              value={sortBy}
              onChange={(e) =>
                setSortBy(e.target.value as "date" | "weight" | "sets")
              }
              className="w-full sm:max-w-xs px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
            >
              <option value="date">Date (Newest)</option>
              <option value="weight">Weight (Heaviest)</option>
              <option value="sets">Sets (Most)</option>
            </select>
          </div>
        </div>

        {/* Card display setting */}
        <div className="w-full flex justify-end text-2xl font-semibold text-slate-700 dark:text-slate-300 cursor-pointer mb-8">
          <LuLayoutGrid onClick={handleChangeCardLayout} />
        </div>

        {/* Workouts Display */}
        <div className="max-h-[120vh] overflow-y-auto">
          {sortedWorkouts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                {workouts.length === 0
                  ? "No workouts logged yet"
                  : "No workouts match your search criteria"}
              </p>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                {workouts.length === 0
                  ? "Start logging your workouts to see them here"
                  : "Try adjusting your filters"}
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-2">
                Showing{" "}
                <span className="text-slate-900 dark:text-white font-bold">
                  {sortedWorkouts.length}
                </span>{" "}
                workout{sortedWorkouts.length !== 1 ? "s" : ""}
              </p>
              {sortedWorkouts.map((workout) => (
                <WorkoutCard
                  key={workout.id}
                  workout={workout}
                  onDelete={onDelete}
                  onEdit={handleEdit}
                  options={layout}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editingWorkout && (
        <WorkoutEditModal
          workout={editingWorkout}
          isOpen={true}
          onClose={handleCloseModal}
          onSave={handleSaveWorkout}
        />
      )}
    </>
  );
}
