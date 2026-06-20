"use client";
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
  const {
    clearWorkouts,
    workoutCount,
    deleteWorkout,
    updateWorkout,
  } = useWorkouts();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState<10 | 25 | 50 | 100>(10);
  const [prevPage, setPrevPage] = useState(page - 1);
  const [nextPage, setNextPage] = useState(page + 1);
  const totalPages = Math.ceil(workoutCount / pageSize);

  useEffect(() => {
    return () => {
      clearWorkouts();
    }
  }, [])

  // for toast disappearing
  useEffect(() => {
    setTimeout(() => {
      setToast(null);
    }, 5000);
  }, []);

  // set previous and next page numbers
  useEffect(() => {
    setPrevPage(page - 1);
    setNextPage(page + 1);
  }, [page]);

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
  };

  const handlePrevPage = () => {
    setPage((prev) => (prev === 1 ? prev : prev - 1));
  };

  const handleNextPage = () => {
    setPage((prev) => (prev === totalPages ? prev : prev + 1));
  };

  // requires db to keep track of count
  const handleLastPage = () => {
    setPage(totalPages);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
      {toast ? (
        <Toast message={toast.message} type={toast.type} />
      ) : (
        <div></div>
      )}

      <WorkoutList
        page={page}
        setPage={setPage}
        pageSize={pageSize}
        setPageSize={setPageSize}
        onDelete={handleDeleteWorkout}
        onUpdate={handleUpdateWorkout}
      />

      <div id="paginator" className="flex flex-row justify-between mt-5">
        <div className="flex flex-row gap-2">
          <button onClick={handleFirstPage} className="paginateBtn">
            First
          </button>
          <button
            onClick={handlePrevPage}
            className="paginateBtn hidden sm:block"
          >
            Prev Page
          </button>
        </div>
        <div className="flex gap-1 sm:gap-4">
          {prevPage !== 0 ? (
            <button onClick={handlePrevPage} className="paginateBtn">
              {prevPage}
            </button>
          ) : (
            <div></div>
          )}
          <button className="paginateBtn bg-blue-500!">{page}</button>
          {page !== totalPages ? (
            <button onClick={handleNextPage} className="paginateBtn">
              {nextPage}
            </button>
          ) : (
            <div></div>
          )}
        </div>
        <div className="flex flex-row gap-2">
          <button
            onClick={handleNextPage}
            className="paginateBtn hidden sm:block"
          >
            Next Page
          </button>
          <button onClick={handleLastPage} className="paginateBtn">
            Last
          </button>
        </div>
      </div>
    </div>
  );
}
