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
    const [filterType, setFilterType] = useState<string>('all');
    const [sortBy, setSortBy] = useState<'date' | 'weight' | 'sets'>('date');
    const [editingWorkout, setEditingWorkout] = useState<Workout | null>(null);

    const filteredWorkouts = workouts.filter((w) => filterType === 'all' || w.type === filterType);

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
            <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
                <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Workout History</h2>

                {/* Filters and Sort */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Filter by Type
                        </label>
                        <select
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All Types</option>
                            <option value="cardio">Cardio</option>
                            <option value="strength">Strength</option>
                            <option value="flexibility">Flexibility</option>
                            <option value="sports">Sports</option>
                        </select>
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-2">
                            Sort by
                        </label>
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value as 'date' | 'weight' | 'sets')}
                            className="w-full px-3 py-2 border border-zinc-300 dark:border-zinc-600 rounded-md bg-white dark:bg-zinc-800 text-black dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="date">Date (Newest)</option>
                            <option value="weight">Weight (Heaviest)</option>
                            <option value="sets">Sets (Most)</option>
                        </select>
                    </div>
                </div>

                {/* Workouts Display */}
                {sortedWorkouts.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-lg text-zinc-500 dark:text-zinc-400">
                            {filterType === 'all'
                                ? 'No workouts logged yet'
                                : `No ${filterType} workouts found`}
                        </p>
                    </div>
                ) : (
                    <div className="space-y-4">
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-4">
                            Showing {sortedWorkouts.length} workout{sortedWorkouts.length !== 1 ? 's' : ''}
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
