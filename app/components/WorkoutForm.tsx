'use client';

import { useState } from 'react';
import type { Workout } from '../utils/workoutData';
import { getExercisesByType } from '../utils/exercises';

interface WorkoutFormProps {
    onAdd: (workout: Omit<Workout, 'id'>) => void;
}

export default function WorkoutForm({ onAdd }: WorkoutFormProps) {
    const [formData, setFormData] = useState<{
        name: string;
        type: Workout['type'];
        sets: string;
        reps: string;
        weight: string;
        intensity: Workout['intensity'];
        notes: string;
    }>({
        name: '',
        type: 'strength',
        sets: '',
        reps: '',
        weight: '',
        intensity: 'medium',
        notes: '',
    });

    const availableExercises = getExercisesByType(formData.type);

    const handleTypeChange = (newType: string) => {
        setFormData({
            ...formData,
            type: newType as Workout['type'],
            name: '', // Reset exercise name when type changes
        });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.sets || !formData.reps || formData.weight === '') {
            alert('Please fill in all required fields');
            return;
        }

        onAdd({
            name: formData.name,
            type: formData.type as Workout['type'],
            sets: parseInt(formData.sets),
            reps: parseInt(formData.reps),
            weight: parseInt(formData.weight),
            intensity: formData.intensity as Workout['intensity'],
            date: new Date(),
            notes: formData.notes || undefined,
        });

        // Reset form
        setFormData({
            name: '',
            type: 'strength',
            sets: '',
            reps: '',
            weight: '',
            intensity: 'medium',
            notes: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800"
        >
            <h2 className="text-xl font-semibold mb-6 text-black dark:text-white">
                Log a Workout
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Exercise Type *
                    </label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleTypeChange(e.target.value)}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="strength">Strength</option>
                        <option value="cardio">Cardio</option>
                        <option value="flexibility">Flexibility</option>
                        <option value="sports">Sports</option>
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Exercise Name *
                    </label>
                    <select
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="">Select an exercise...</option>
                        {availableExercises.map((exercise) => (
                            <option key={exercise} value={exercise}>
                                {exercise}
                            </option>
                        ))}
                    </select>
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Sets *
                    </label>
                    <input
                        type="number"
                        value={formData.sets}
                        onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                        placeholder="4"
                        min="1"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Reps *
                    </label>
                    <input
                        type="number"
                        value={formData.reps}
                        onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                        placeholder="8"
                        min="1"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Weight (kg) *
                    </label>
                    <input
                        type="number"
                        value={formData.weight}
                        onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                        placeholder="225"
                        min="0"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Intensity *
                    </label>
                    <select
                        value={formData.intensity}
                        onChange={(e) => {
                            const value = e.target.value;
                            setFormData({ ...formData, intensity: value as Workout['intensity'] });
                        }}
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                    </select>
                </div>

                <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                        Notes (optional)
                    </label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="How did it feel?"
                        className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-md transition-colors duration-200"
            >
                Log Workout
            </button>
        </form>
    );
}
