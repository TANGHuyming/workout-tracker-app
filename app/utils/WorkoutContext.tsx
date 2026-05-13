'use client';

import { createContext, useContext, useState, useCallback, ReactNode } from 'react';
import type { Workout } from './workoutData';

interface WorkoutContextType {
    workouts: Workout[];
    isLoading: boolean;
    error: string | null;
    fetchWorkouts: () => Promise<void>;
    addWorkout: (workout: Omit<Workout, 'id'>) => Promise<Workout>;
    updateWorkout: (id: string, updates: Partial<Workout>) => Promise<Workout>;
    deleteWorkout: (id: string) => Promise<void>;
}

const WorkoutContext = createContext<WorkoutContextType | undefined>(undefined);

export function WorkoutProvider({ children }: { children: ReactNode }) {
    const [workouts, setWorkouts] = useState<Workout[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchWorkouts = useCallback(async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await fetch('/api/workouts');

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'Failed to fetch workouts');
            }

            const data = await response.json();
            setWorkouts(
                data.workouts.map((w: any) => ({
                    id: w.id,
                    name: w.name,
                    type: w.type,
                    sets: w.sets,
                    reps: w.reps,
                    weight: w.weight,
                    intensity: w.intensity,
                    date: new Date(w.date),
                    notes: w.notes,
                }))
            );
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Failed to fetch workouts';
            setError(message);
            console.error('Error fetching workouts:', err);
        } finally {
            setIsLoading(false);
        }
    }, []);

    const addWorkout = useCallback(
        async (workout: Omit<Workout, 'id'>) => {
            try {
                setError(null);
                const response = await fetch('/api/workouts', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        name: workout.name,
                        type: workout.type,
                        sets: workout.sets,
                        reps: workout.reps,
                        weight: workout.weight,
                        intensity: workout.intensity,
                        date: workout.date,
                        notes: workout.notes,
                    }),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to add workout');
                }

                const data = await response.json();
                const newWorkout: Workout = {
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

                setWorkouts((prev) => [newWorkout, ...prev]);
                return newWorkout;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to add workout';
                setError(message);
                throw err;
            }
        },
        []
    );

    const updateWorkout = useCallback(
        async (id: string, updates: Partial<Workout>) => {
            try {
                setError(null);
                const response = await fetch(`/api/workouts/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(updates),
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to update workout');
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

                setWorkouts((prev) =>
                    prev.map((w) => (w.id === id ? updatedWorkout : w))
                );

                return updatedWorkout;
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to update workout';
                setError(message);
                throw err;
            }
        },
        []
    );

    const deleteWorkout = useCallback(
        async (id: string) => {
            try {
                setError(null);
                const response = await fetch(`/api/workouts/${id}`, {
                    method: 'DELETE',
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || 'Failed to delete workout');
                }

                setWorkouts((prev) => prev.filter((w) => w.id !== id));
            } catch (err) {
                const message = err instanceof Error ? err.message : 'Failed to delete workout';
                setError(message);
                throw err;
            }
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
                deleteWorkout,
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
