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

    const ratio = workout.weight > 0 && workout.bodyweight > 0 ? (workout.weight / workout.bodyweight).toFixed(2) : '0';

    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-xl shadow-sm border border-slate-200 dark:border-slate-700 hover:shadow-md transition-all duration-200 group">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-start gap-3 mb-3">
                        <div className="flex-1">
                            <h3 className="text-lg font-bold text-slate-900 dark:text-white">
                                {workout.name}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">{formattedDate}</p>
                        </div>
                    </div>

                    <div className="grid grid-cols-4 gap-3 mb-4 pt-4 border-t border-slate-100 dark:border-slate-700">
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Sets</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                {workout.sets}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Reps</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                {workout.reps}
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Weight</p>
                            <p className="text-xl font-bold text-slate-900 dark:text-white mt-1">
                                {workout.weight} <span className="text-sm font-normal text-slate-500 dark:text-slate-400">kg</span>
                            </p>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide">Ratio</p>
                            <p className="text-xl font-bold text-blue-600 dark:text-blue-400 mt-1">
                                {ratio}x
                            </p>
                        </div>
                    </div>

                    <div className="bg-slate-50 dark:bg-slate-900/50 rounded-lg p-3">
                        <p className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Bodyweight</p>
                        <p className="text-sm text-slate-900 dark:text-white font-medium">
                            {workout.bodyweight} kg
                        </p>
                    </div>

                    {workout.notes && (
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-3 italic border-l-2 border-slate-300 dark:border-slate-600 pl-3 py-1 bg-slate-50 dark:bg-slate-900/30 px-3 rounded">
                            "{workout.notes}"
                        </p>
                    )}
                </div>

                <div className="flex gap-2 sm:flex-col sm:w-auto">
                    {onEdit && (
                        <button
                            onClick={() => onEdit(workout)}
                            className="flex-1 sm:flex-none px-4 py-2 bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900 transition-colors text-sm font-semibold border border-blue-200 dark:border-blue-800 whitespace-nowrap"
                        >
                            Edit
                        </button>
                    )}
                    <button
                        onClick={() => {
                            if (confirm('Are you sure you want to delete this workout?')) {
                                onDelete(workout.id);
                            }
                        }}
                        className="flex-1 sm:flex-none px-4 py-2 bg-red-50 dark:bg-red-950/50 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-100 dark:hover:bg-red-900 transition-colors text-sm font-semibold border border-red-200 dark:border-red-800 whitespace-nowrap"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}
