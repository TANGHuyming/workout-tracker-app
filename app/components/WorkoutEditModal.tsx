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
        sets: workout.sets,
        reps: workout.reps,
        weight: workout.weight,
        bodyweight: workout.bodyweight,
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
                sets: workout.sets,
                reps: workout.reps,
                weight: workout.weight,
                bodyweight: workout.bodyweight,
                date: workout.date,
                notes: workout.notes,
            });
            setError(null);
        }
    }, [isOpen, workout]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        // Validation
        if (!formData.name || formData.sets === undefined || formData.reps === undefined || formData.weight === undefined || formData.bodyweight === undefined) {
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
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto border border-slate-200 dark:border-slate-800">
                {/* Header */}
                <div className="sticky top-0 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-b border-slate-200 dark:border-slate-800 p-6 flex justify-between items-center">
                    <div>
                        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Edit Workout</h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">{formData.name}</p>
                    </div>
                    <button
                        onClick={onClose}
                        className="text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 text-2xl leading-none transition-colors p-2 hover:bg-slate-200 dark:hover:bg-slate-800 rounded-lg"
                    >
                        ✕
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    {error && (
                        <div className="p-4 bg-red-50 dark:bg-red-950/50 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 rounded-lg text-sm font-medium">
                            {error}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Exercise Name *
                        </label>
                        <select
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="">Select an exercise...</option>
                            {availableExercises.map((exercise) => (
                                <option key={exercise} value={exercise}>
                                    {exercise}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Sets *
                            </label>
                            <input
                                type="number"
                                value={formData.sets}
                                onChange={(e) => setFormData({ ...formData, sets: parseInt(e.target.value) || 0 })}
                                placeholder="4"
                                min="1"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Reps *
                            </label>
                            <input
                                type="number"
                                value={formData.reps}
                                onChange={(e) => setFormData({ ...formData, reps: parseInt(e.target.value) || 0 })}
                                placeholder="8"
                                min="1"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Weight (kg) *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.weight}
                                onChange={(e) => setFormData({ ...formData, weight: parseFloat(e.target.value) || 0 })}
                                placeholder="225"
                                min="0"
                                max="500"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Bodyweight (kg) *
                            </label>
                            <input
                                type="number"
                                step="0.1"
                                value={formData.bodyweight}
                                onChange={(e) => setFormData({ ...formData, bodyweight: parseFloat(e.target.value) || 0 })}
                                placeholder="80"
                                min="20"
                                max="300"
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.date instanceof Date ? formData.date.toISOString().split('T')[0] : ''}
                            onChange={(e) => setFormData({ ...formData, date: new Date(e.target.value) })}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Notes
                        </label>
                        <textarea
                            value={formData.notes || ''}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            placeholder="Add any notes..."
                            rows={3}
                        />
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-3 pt-5 border-t border-slate-200 dark:border-slate-800">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold transition-colors text-sm"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSaving}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 disabled:from-blue-400 disabled:to-blue-300 text-white font-semibold rounded-lg transition-all text-sm disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSaving ? (
                                <>
                                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Saving...
                                </>
                            ) : (
                                '✓ Save Changes'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
