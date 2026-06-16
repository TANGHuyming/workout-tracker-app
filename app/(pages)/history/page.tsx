"use client";
import { useRouter, useSearchParams } from "next/navigation";
import Toast from "@/app/components/Toast";
import type { Workout } from "@/app/utils/workout/workoutData";
import WorkoutList from "@/app/components/WorkoutList";
import { useWorkouts } from "@/app/utils/workout/WorkoutContext";
import { useState, useEffect } from "react";

export default function HistoryPage() {
  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(true);
  const { workouts, fetchWorkouts, deleteWorkout, updateWorkout } =
    useWorkouts();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50 | 100>(10);
  const [prevPage, setPrevPage] = useState(page - 1);
  const [currentPage, setCurrentPage] = useState(page);
  const [nextPage, setNextPage] = useState(page + 1);
  const isFiltered = searchParams.get("isFiltered") !== "true" ? false : true;

  useEffect(() => {
    const fetcher = async () => {
      setIsLoading(true);
      try {
        await fetchWorkouts(currentPage, pageSize);
      } catch (err) {
        setToast({
          message:
            err instanceof Error ? err.message : "Failed to fetch workouts",
          type: "error",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (!isFiltered) {
      fetcher();
    }
    setIsLoading(false);
  }, [page, pageSize]);

  useEffect(() => {
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  useEffect(() => {
    router.push(
      `?page=${page}&pageSize=${pageSize}&isFiltered=${isFiltered}#paginator`,
    );
  }, [page, pageSize]);

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

  const handleFirstPage = () => {
    setPage(1);
    setPrevPage(0);
    setCurrentPage(1);
    setNextPage(2);
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev === 1 ? prev : prev - 1));
    setPrevPage((prev) => (prev === 0 ? prev : prev - 1));
    setCurrentPage((prev) => (prev === 1 ? prev : prev - 1));
    setNextPage((prev) => (prev === 2 ? prev : prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => prev + 1);
    setPrevPage((prev) => prev + 1);
    setCurrentPage((prev) => prev + 1);
    setNextPage((prev) => prev + 1);
  };

  // requires db to keep track of count
  // const handleLastPage = () => {
  //   setPage(totalPages);
  // }

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
      {toast ? (
        <Toast message={toast.message} type={toast.type} />
      ) : (
        <div></div>
      )}
      <WorkoutList
        workouts={workouts}
        page={page}
        pageSize={pageSize}
        onDelete={handleDeleteWorkout}
        onUpdate={handleUpdateWorkout}
      />

      <div id="paginator" className="flex flex-row justify-between">
        <button onClick={handleFirstPage}>First</button>
        <button onClick={handlePrevPage}>Prev Page</button>
        <div>
          <button onClick={handlePrevPage}>{prevPage}</button>
          <button>{page}</button>
          <button onClick={handleNextPage}>{nextPage}</button>
        </div>
        <button onClick={handleNextPage}>Next Page</button>
        <button onClick={() => console.log("Not implemented yet")}>Last</button>
      </div>
    </div>
  );
}
