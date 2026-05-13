'use client';

import { useState, useEffect } from 'react';
import type { Workout } from '../utils/workoutData';
import { getAllExercises } from '../utils/exercises';

interface WorkoutEditModalProps {
    workout: Workout;
    isOpen: boolean;
    onClose: () => void;
    onSave: (id: string, updates: Partial<Workout>) => Promise<void>;
}

export default function WorkoutEditModal({ workout, isOpen, onClose, onSave }: WorkoutEditModalProps) {
    const [formData, setFormData] = useState<Workout>({
        id: workout.id,
        name: workout.name,
        type: workout.type,
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        intensity: workout.intensity,
        date: workout.date,
        notes: workout.notes,
    });
    const [isSaving, setIsSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const availableExercises = getAllExercises();

    useEffect(() => {
        if (isOpen) {
            setFormData({
                id: workout.id,
                name: workout.name,
                type: workout.type,
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
                intensity: workout.intensity,
                date: workout.date,
                notes: workout.notes,
            });
            setError(null);
        }
    }, [isOpen, workout]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || formData.sets === undefined || formData.reps === undefined || formData.weight === undefined) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setIsSaving(true);
            setError(null);
            await onSave(workout.id, formData);
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to save workout');
        } finally {
            setIsSaving(false);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-zinc-900 rounded-lg shadow-xl w-full max-w-md max-h-[90vh] overflow-y-auto">
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 p-6 flex justify-between items-center">
                    <h2 className="text-xl font-bold text-black dark:text-white">Edit Workout</h2>
                    <button
                        onClick={onClose}
                        className="text-zinc-500 hover:text-zinc-700 dark:hover:text-zinc-300 text-2xl leading-none"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    {error && (
                        <div className="p-3 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded-md text-sm">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
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
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Sets *
                        </label>
                        <input
                            type="number"
                            value={formData.sets}
                            onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
                            placeholder="4"
                            min="1"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Reps *
                        </label>
                        <input
                            type="number"
                            value={formData.reps}
                            onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                            placeholder="8"
                            min="1"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Weight (kg) *
                        </label>
                        <input
                            type="number"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: parseInt(e.target.value) || 0 })}
                            placeholder="225"
                            min="0"
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add any notes..."
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-4 border-t border-zinc-200 dark:border-zinc-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 font-medium transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium rounded-md transition-colors"
                        >
                            {isSaving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
