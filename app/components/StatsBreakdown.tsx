import type { WorkoutStats } from '../utils/workoutData';

interface StatsBreakdownProps {
    stats: WorkoutStats;
}

export default function StatsBreakdown({ stats }: StatsBreakdownProps) {
    const StatCard = ({
        label,
        value,
        unit,
        icon,
        bgGradient,
    }: {
        label: string;
        value: string | number;
        unit?: string;
        icon: string;
        bgGradient?: string;
    }) => (
        <div className={`${bgGradient || 'bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20'} p-5 rounded-xl border border-blue-200/50 dark:border-blue-700/50 hover:shadow-md transition-shadow`}>
            <div className="flex items-start justify-between mb-3">
                <div>
                    <p className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wide">{label}</p>
                </div>
                <span className="text-3xl">{icon}</span>
            </div>
            <p className="text-3xl font-bold text-slate-900 dark:text-white">
                {value}
                {unit && <span className="text-sm text-slate-600 dark:text-slate-400 ml-2 font-normal">{unit}</span>}
            </p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Your Stats
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">Track your performance metrics</p>
            </div>

            {stats.totalWorkouts === 0 ? (
                <div className="text-center py-16">
                    <div className="text-6xl mb-4">📊</div>
                    <p className="text-lg font-medium text-slate-700 dark:text-slate-300">
                        No stats yet
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Log your first workout to see your stats</p>
                </div>
            ) : (
                <>
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        <StatCard
                            icon="🏋️"
                            label="Total Workouts"
                            value={stats.totalWorkouts}
                            bgGradient="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20"
                        />
                        <StatCard
                            icon="📊"
                            label="Total Sets"
                            value={stats.totalSets}
                            bgGradient="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20"
                        />
                        <StatCard
                            icon="🔢"
                            label="Total Reps"
                            value={stats.totalReps}
                            bgGradient="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20"
                        />
                        <StatCard
                            icon="⚖️"
                            label="Avg Weight"
                            value={stats.averageWeight}
                            unit="kg"
                            bgGradient="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20"
                        />
                        <StatCard
                            icon="💪"
                            label="Heaviest Lift"
                            value={stats.heaviestWeight}
                            unit="kg"
                            bgGradient="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20"
                        />
                        <StatCard
                            icon="📈"
                            label="Avg Reps/Set"
                            value={stats.averageRepsPerSet}
                            bgGradient="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/20 dark:to-cyan-800/20"
                        />
                        <StatCard
                            icon="📅"
                            label="Last Workout"
                            value={stats.lastWorkoutDate}
                            bgGradient="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-900/20 dark:to-indigo-800/20"
                        />
                        <StatCard
                            icon="🔥"
                            label="Current Streak"
                            value={stats.streakDays}
                            unit="days"
                            bgGradient="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20"
                        />
                    </div>
                </>
            )}
        </div>
    );
}
