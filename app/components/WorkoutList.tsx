'use client';

import { useState } from 'react';
import type { Workout } from '../utils/workoutData';
import WorkoutCard from './WorkoutCard';
import WorkoutEditModal from './WorkoutEditModal';

interface WorkoutListProps {
    workouts: Workout[];
    onDelete: (id: string) => void;
    onUpdate?: (id: string, updates: Partial<Workout>) => Promise<void>;
}

export default function WorkoutList({ workouts, onDelete, onUpdate }: WorkoutListProps) {
    const [searchExercise, setSearchExercise] = useState<string>('');
    const [searchDate, setSearchDate] = useState<string>('');
    const [searchWeight, setSearchWeight] = useState<string>('');
    const [sortBy, setSortBy] = useState<'date' | 'weight' | 'sets'>('date');
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

    const filteredWorkouts = workouts.filter((w) => {
        // Filter by exercise name
        const exerciseMatch = searchExercise === '' || 
            w.name.toLowerCase().includes(searchExercise.toLowerCase());
        
        // Filter by date
        const dateMatch = searchDate === '' ||
            new Date(w.date).toISOString().split('T')[0] === searchDate;
        
        // Filter by weight (minimum weight)
        const weightMatch = searchWeight === '' ||
            w.weight >= parseInt(searchWeight);
        
        return exerciseMatch && dateMatch && weightMatch;
    });

    const sortedWorkouts = [...filteredWorkouts].sort((a, b) => {
        switch (sortBy) {
            case 'weight':
                return b.weight - a.weight;
            case 'sets':
                return b.sets - a.sets;
            case 'date':
            default:
                return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
    });

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

    return (
        <>
            <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
                <div className="mb-8">
                    <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                        Workout History
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Search and filter your logged workouts</p>
                </div>

                {/* Search and Sort */}
                <div className="space-y-6 mb-8 p-6 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-200 dark:border-slate-700">
                    {/* Search Inputs */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        <div>
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

                        <div>
                            <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                                Date
                            </label>
                            <input
                                type="date"
                                value={searchDate}
                                onChange={(e) => setSearchDate(e.target.value)}
                                className="box-border min-w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                        </div>

                        <div>
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
                    </div>

                    {/* Sort */}
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">
                            Sort By
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'weight' | 'sets')}
                            className="w-full sm:max-w-xs px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        >
                            <option value="date">📅 Date (Newest)</option>
                            <option value="weight">⚖️ Weight (Heaviest)</option>
                            <option value="sets">📊 Sets (Most)</option>
                        </select>
                    </div>
                </div>

                {/* Workouts Display */}
                {sortedWorkouts.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="text-5xl mb-4">🏋️</div>
                        <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                            {workouts.length === 0 
                                ? 'No workouts logged yet' 
                                : 'No workouts match your search criteria'}
                        </p>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                            {workouts.length === 0 ? 'Start logging your workouts to see them here' : 'Try adjusting your filters'}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm font-semibold text-slate-600 dark:text-slate-400 px-2">
                            Showing <span className="text-slate-900 dark:text-white font-bold">{sortedWorkouts.length}</span> workout{sortedWorkouts.length !== 1 ? 's' : ''}
                        </p>
                        {sortedWorkouts.map((workout) => (
                            <WorkoutCard
                                key={workout.id}
                                workout={workout}
                                onDelete={onDelete}
                                onEdit={handleEdit}
                            />
                        ))}
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
