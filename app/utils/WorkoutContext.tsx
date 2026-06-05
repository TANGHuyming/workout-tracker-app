'use client';
import { createContext, useContext, useState, useCallback, ReactNode, useEffect } from 'react';
import type { Workout } from './workoutData';
import { getWorkouts, postWorkout, putWorkout, deleteWorkout } from './workout/fetchWorkouts';

interface WorkoutContextType {
    workouts: Workout[];
    isLoading: boolean;
    error: string | null;
    fetchWorkouts: () => Promise<void>;
    addWorkout: (workout: Omit<Workout, 'id'>, csrfToken: string) => Promise<Workout | null>;
    updateWorkout: (id: string, updates: Partial<Workout>, csrfToken: string) => Promise<Workout | null>;
    removeWorkout: (id: string, csrfToken: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkouts = useCallback(
        async () => {
            setIsLoading(true);
            setError(null);

            const workouts = await getWorkouts();

            if(!workouts || workouts.length === 0) {
                setError('No workouts found');
                setIsLoading(false);
                return;
            }

            setWorkouts(
                workouts.map((w: any) => ({
                    id: w.id,
                    name: w.name,
                    type: w.type,
                    sets: w.sets,
                    reps: w.reps,
                    weight: w.weight,
                    bodyweight: w.bodyweight,
                    intensity: w.intensity,
                    date: new Date(w.date),
                    notes: w.notes,
                }))
            );
            
            setIsLoading(false);
        }, 
        []
    );

    const addWorkout = useCallback(
        async (workout: Omit<Workout, 'id'>, csrfToken: string) => {
            setError(null);
            const data = await postWorkout(workout, csrfToken);

            if(!data) {
                setError('Failed to add workout');
                return null;
            }

            const newWorkout: Workout = {
                id: data?.id,
                name: data?.name,
                sets: data?.sets,
                reps: data?.reps,
                weight: data?.weight,
                bodyweight: data?.bodyweight,
                date: new Date(data?.date),
                notes: data?.notes,
            };

            setWorkouts((prev) => [newWorkout, ...prev]);
            return newWorkout;
        },
        []
    );

    const updateWorkout = useCallback(
        async (id: string, updates: Partial<Workout>, csrfToken: string) => {
            setError(null);
            const data = await putWorkout(id, updates, csrfToken);

            if(!data) {
                setError('Failed to update workout');
                return null;
            }

            const updatedWorkout: Workout = {
                id: data?.id,
                name: data?.name,
                sets: data?.sets,
                reps: data?.reps,
                weight: data?.weight,
                bodyweight: data?.bodyweight,
                date: new Date(data?.date),
                notes: data?.notes,
            };

            setWorkouts((prev) =>
                prev.map((w) => (w.id === id ? updatedWorkout : w))
            );

            return updatedWorkout;
        },
        []
    );

    const removeWorkout = useCallback(
        async (id: string, csrfToken: string) => {
            setError(null);
            
            await deleteWorkout(id, csrfToken);

            setWorkouts((prev) => prev.filter((w) => w.id !== id));
        },
        []
    );

    return (
        <WorkoutContext.Provider
            value={{
                workouts,
                isLoading,
                error,
                fetchWorkouts,
                addWorkout,
                updateWorkout,
                removeWorkout,
            }}
        >
            {children}
        </WorkoutContext.Provider>
    );
}

export function useWorkouts() {
    const context = useContext(WorkoutContext);
    if (context === undefined) {
        throw new Error('useWorkouts must be used within a WorkoutProvider');
    }
    return context;
}
