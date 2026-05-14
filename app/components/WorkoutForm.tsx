'use client';

import { useState } from 'react';
import type { Workout } from '../utils/workoutData';
import { getAllExercises } from '../utils/exercises';

interface WorkoutFormProps {
    onAdd: (workout: Omit<Workout, 'id'>) => void;
}

export default function WorkoutForm({ onAdd }: WorkoutFormProps) {
    const [formData, setFormData] = useState<{
        name: string;
        sets: string;
        reps: string;
        weight: string;
        bodyweight: string;
        date: string;
        notes: string;
    }>({
        name: '',
        sets: '',
        reps: '',
        weight: '',
        bodyweight: '',
        date: new Date().toISOString().split('T')[0],
        notes: '',
    });

    const availableExercises = getAllExercises();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.name || !formData.sets || !formData.reps || formData.weight === '' || formData.bodyweight === '') {
            const error = new Error('Please fill in all required fields');
            console.error(error);
            return;
        }

        onAdd({
            name: formData.name,
            sets: parseInt(formData.sets),
            reps: parseInt(formData.reps),
            weight: parseFloat(formData.weight),
            bodyweight: parseFloat(formData.bodyweight),
            date: new Date(formData.date),
            notes: formData.notes || undefined,
        });

        // Reset form
        setFormData({
            name: '',
            sets: '',
            reps: '',
            weight: '',
            bodyweight: '',
            date: new Date().toISOString().split('T')[0],
            notes: '',
        });
    };

    return (
        <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800 sticky top-24"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Log Workout
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track your progress today</p>
            </div>

            <div className="space-y-6">
                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-3">
                        Exercise Name *
                    </label>
                    <select
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none"
                    >
                        <option value="">Select an exercise...</option>
                        {availableExercises.map((exercise) => (
                            <option key={exercise} value={exercise}>
                                {exercise}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Sets *
                        </label>
                        <input
                            type="number"
                            value={formData.sets}
                            onChange={(e) => setFormData({ ...formData, sets: e.target.value })}
                            placeholder="4"
                            min="1"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Reps *
                        </label>
                        <input
                            type="number"
                            value={formData.reps}
                            onChange={(e) => setFormData({ ...formData, reps: e.target.value })}
                            placeholder="8"
                            min="1"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Weight (kg) *
                        </label>
                        <input
                            type="number"
                            step="0.1"
                            value={formData.weight}
                            onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
                            placeholder="225"
                            min="0"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
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
                            onChange={(e) => setFormData({ ...formData, bodyweight: e.target.value })}
                            placeholder="80"
                            min="20"
                            max="300"
                            className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Date *
                    </label>
                    <input
                        type="date"
                        value={formData.date}
                        onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                        className="max-w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                        Notes (optional)
                    </label>
                    <input
                        type="text"
                        value={formData.notes}
                        onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        placeholder="How did it feel? PRs? Injuries?"
                        className="w-full px-4 py-3 border border-slate-300 dark:border-slate-600 rounded-lg bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <button
                type="submit"
                className="w-full mt-8 bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-700 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg active:scale-95"
            >
                ✓ Log Workout
            </button>
        </form>
    );
}
