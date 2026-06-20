"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import clsx from "clsx";
import type { Workout } from "../utils/workout/workoutData";
import WorkoutCard from "./WorkoutCard";
import WorkoutEditModal from "./WorkoutEditModal";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { LuLayoutGrid, LuCreditCard } from "react-icons/lu";
import { FaListUl } from "react-icons/fa";

interface WorkoutListProps {
  page: number;
  setPage: any;
  pageSize: 10 | 25 | 50 | 100;
  setPageSize: any;
  onDelete: (id: string) => void;
  onUpdate?: (id: string, updates: Partial<Workout>) => Promise<void>;
}

export default function WorkoutList({
  page,
  setPage,
  pageSize,
  setPageSize,
  onDelete,
  onUpdate,
}: WorkoutListProps) {
  const router = useRouter();
  const { workouts, fetchWorkoutsByAll } = useWorkouts();
  const [searchExercise, setSearchExercise] = useState<string>("");
  const [searchStartDate, setSearchStartDate] = useState<string>("");
  const [searchEndDate, setSearchEndDate] = useState<string>("");
  const [searchWeight, setSearchWeight] = useState<string>("");
  const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);
  const [index, setIndex] = useState<number>(1);
  const [isList, setIsList] = useState(true);
  const [isCompact, setIsCompact] = useState(false);
  const [isPageSizeDropdown, setIsPageSizeDropdown] = useState(false);
  const [isLoading, setIsLoading] = useState(!!workouts);
  const [refresh, setRefresh] = useState(false);
  const pageSizeOptions = [10, 25, 50, 100];

  useEffect(() => {
    const onMountFetch = async () => {
      try {
        setIsLoading(true);

        let startDate = new Date(searchStartDate);
        let endDate = new Date(searchEndDate);

        if (startDate > endDate) {
          startDate = new Date(searchEndDate);
          endDate = new Date(searchStartDate);
        }

        await fetchWorkoutsByAll(
          {
            startDate: searchStartDate.length === 0 ? new Date(0) : startDate,
            endDate: searchEndDate.length === 0 ? new Date() : endDate,
          },
          searchExercise,
          parseFloat(searchWeight),
          page,
          pageSize,
        );

        router.push(`#paginator`);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }

    onMountFetch();
  }, [page, pageSize, refresh]);

  const handleFilterByAll = () => {
    setPage(1);
    setPageSize(10);
    setRefresh(prev => !prev);
  }

  const handleClearFilters = () => {
    setSearchStartDate("");
    setSearchEndDate("");
    setSearchExercise("");
    setSearchWeight("");
    setPage(1);
    setPageSize(10);
    setRefresh(prev => !prev);
  };

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
      setIsCompact(false);
    } else if (layouts[index] === "compact") {
      setIsCompact(true);
    }
  };

  // Change how each card is displayed: card is grid-like while list is a list
  const handleChangeListLayout = () => {
    setIsList((prev) => !prev);
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
          <div className="flex flex-col gap-4">
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  Start date
                </label>
                <input
                  type="date"
                  value={searchStartDate}
                  onChange={(e) => setSearchStartDate(e.target.value)}
                  className="cursor-text px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                  End date
                </label>
                <input
                  type="date"
                  value={searchEndDate}
                  onChange={(e) => setSearchEndDate(e.target.value)}
                  className="cursor-text px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                />
              </div>
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
              onClick={handleFilterByAll}
              className={clsx(
                "border-blue-50 py-2 px-4 text-sm text-white rounded-lg w-full cursor-pointer hover:bg-blue-950/50 active:bg-blue-800",
                isLoading ? "bg-blue-950/50" : "bg-blue-950",
              )}
              disabled={isLoading}
            >
              {isLoading ? "Applying..." : "Apply filters"}
            </button>
            <button
              type="button"
              onClick={handleClearFilters}
              className={clsx(
                "border-blue-50 py-2 px-4 text-sm rounded-lg w-full cursor-pointer hover:bg-blue-950/50 active:bg-blue-800",
                isLoading ? "bg-blue-950/50" : "bg-blue-950",
              )}
              disabled={isLoading}
            >
              Clear filters
            </button>
          </div>
        </div>

        {/* Card display setting */}
        <div className="w-full flex justify-between font-semibold text-slate-700 dark:text-slate-300 mb-8 gap-4">
          <div
            onMouseEnter={() => setIsPageSizeDropdown(true)}
            onMouseLeave={() => setIsPageSizeDropdown(false)}
            className="text-left w-1/3 cursor-pointer relative"
          >
            {pageSize} / page
            {isPageSizeDropdown ? (
              <div className="absolute z-0 w-full">
                <div className="flex flex-col justify-start bg-white/80 dark:bg-slate-900/80 border-b border-slate-200 dark:border-slate-800">
                  {pageSizeOptions.map((opt) => (
                    <button
                      key={`page_size_${opt}`}
                      className="optionBtn"
                      onClick={() => {
                        setPageSize(opt);
                        setPage(1);
                      }}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              <div></div>
            )}
          </div>
          <div className="flex flex-row gap-4 text-2xl cursor-pointer">
            <LuLayoutGrid onClick={handleChangeCardLayout} />
            {isList ? (
              <FaListUl onClick={handleChangeListLayout} />
            ) : (
              <LuCreditCard onClick={handleChangeListLayout} />
            )}
          </div>
        </div>

        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 p-2">
          Showing{" "}
          <span className="text-slate-900 dark:text-white font-bold">
            {workouts.length}
          </span>{" "}
          workout{workouts.length !== 1 ? "s" : ""}
        </p>

        {/* Workouts Display */}
        {isLoading ? (
          <div className="h-screen flex items-center justify-center">
            <div className="text-center">
              <div className="animate-spin rounded-full h-16 w-16 border-3 border-blue-200 dark:border-blue-800 border-t-blue-600 dark:border-t-blue-400 mx-auto mb-6"></div>
              <p className="text-lg font-medium text-slate-600 dark:text-slate-300">
                Loading your workouts...
              </p>
            </div>
          </div>
        ) : (
          <div className="h-screen overflow-y-auto">
            {workouts.length === 0 ? (
              <div className="text-center py-16">
                <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                  No workouts found
                </p>
              </div>
            ) : (
              <div
                className={clsx(
                  "space-y-4 gap-4",
                  isList
                    ? "block"
                    : "grid grid-cols-1 md:grid-cols-3 sm:grid-cols-2",
                )}
              >
                {workouts.map((workout) => (
                  <WorkoutCard
                    key={workout.id}
                    workout={workout}
                    onDelete={onDelete}
                    onEdit={handleEdit}
                    isCompact={isCompact}
                    isList={isList}
                  />
                ))}
              </div>
            )}
          </div>
        )}
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
