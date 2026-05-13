import type { Workout } from '../utils/workoutData';

interface WorkoutCardProps {
    workout: Workout;
    onDelete: (id: string) => void;
    onEdit?: (workout: Workout) => void;
}

export default function WorkoutCard({ workout, onDelete, onEdit }: WorkoutCardProps) {
    const date = new Date(workout.date);
    const formattedDate = date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
    });

    return (
        <div className="bg-white dark:bg-zinc-800 p-4 rounded-lg shadow border border-zinc-200 dark:border-zinc-700 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex-1">
                    <h3 className="text-lg font-semibold text-black dark:text-white mb-1">
                        {workout.name}
                    </h3>

                    <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">{formattedDate}</p>

                    <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                            <span className="text-zinc-600 dark:text-zinc-400">Sets</span>
                            <p className="font-semibold text-black dark:text-white">
                                {workout.sets}
                            </p>
                        </div>
                        <div>
                            <span className="text-zinc-600 dark:text-zinc-400">Reps</span>
                            <p className="font-semibold text-black dark:text-white">
                                {workout.reps}
                            </p>
                        </div>
                        <div>
                            <span className="text-zinc-600 dark:text-zinc-400">Weight</span>
                            <p className="font-semibold text-black dark:text-white">
                                {workout.weight} kg
                            </p>
                        </div>
                    </div>

                    {workout.notes && (
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-3 italic">
                            "{workout.notes}"
                        </p>
                    )}
                </div>

                <div className="flex gap-2 sm:flex-col">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(workout)}
                            className="flex-1 sm:flex-none px-3 py-2 bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors text-sm font-medium"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={() => onDelete(workout.id)}
                        className="flex-1 sm:flex-none px-3 py-2 bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 rounded hover:bg-red-200 dark:hover:bg-red-800 transition-colors text-sm font-medium"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
