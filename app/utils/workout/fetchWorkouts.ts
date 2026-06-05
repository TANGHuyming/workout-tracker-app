import type { Workout } from '../workoutData';

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export const getWorkouts = async () : Promise<Workout[] | null> => {
    try {
        const response = await fetch(`/api/workouts`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
            },
            next: {
                revalidate: 3600,
            }
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to fetch workouts');
        }

        const data = await response.json();
        return data.workouts;
    }
    catch(err) {
        console.error('Error fetching workouts:', err);
        return null;
    }
}

export const postWorkout = async (workout: Omit<Workout, 'id'>, csrfToken: string): Promise<Workout | null> => {
    try {
        const response = await fetch(`/api/workouts`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({
                name: workout.name,
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
                bodyweight: workout.bodyweight,
                date: workout.date,
                notes: workout.notes,
            }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to add workout');
        }

        const data = await response.json();
        return data.workout;
    }
    catch(err) {
        console.error('Error adding workout:', err);
        return null;
    }
}

export const putWorkout = async (id: string, updates: Partial<Workout>, csrfToken: string): Promise<Workout | null> => {
    try {
        const response = await fetch(`/api/workouts`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({ id, ...updates }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to update workout');
        }

        const data = await response.json();
        return data.workout;
    }
    catch(err) {
        console.error('Error updating workout:', err);
        return null;
    }
}    

export const deleteWorkout = async (id: string, csrfToken: string): Promise<{success: string, message: string}> => {
    try {
        const response = await fetch(`/api/workouts`, {
            method: 'DELETE',
            headers: { 'Content-Type': 'application/json', 'X-CSRF-Token': csrfToken },
            body: JSON.stringify({ id }),
        });

        if (!response.ok) {
            const data = await response.json();
            throw new Error(data.message || 'Failed to delete workout');
        }

        const data = await response.json();
        return data;
    }
    catch(err) {
        console.error('Error deleting workout:', err);
        return { success: 'false', message: err instanceof Error ? err.message : 'Unknown error' };
    }
}