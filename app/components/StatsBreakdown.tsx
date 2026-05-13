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
    }: {
        label: string;
        value: string | number;
        unit?: string;
        icon: string;
    }) => (
        <div className="bg-linear-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 p-4 rounded-lg border border-blue-200 dark:border-blue-700">
            <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">{icon}</span>
                <p className="text-sm text-zinc-600 dark:text-zinc-400">{label}</p>
            </div>
            <p className="text-2xl font-bold text-black dark:text-white">
                {value}
                {unit && <span className="text-lg text-zinc-600 dark:text-zinc-400 ml-1">{unit}</span>}
            </p>
        </div>
    );

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-6 text-black dark:text-white">Workout Stats</h2>

            {stats.totalWorkouts === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg text-zinc-500 dark:text-zinc-400">
                        No workouts logged yet. Start logging to see your stats!
                    </p>
                </div>
            ) : (
                <>
                    {/* Main Stats Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        <StatCard
                            icon="🏋️"
                            label="Total Workouts"
                            value={stats.totalWorkouts}
                        />
                        <StatCard
                            icon="📊"
                            label="Total Sets"
                            value={stats.totalSets}
                        />
                        <StatCard
                            icon="🔢"
                            label="Total Reps"
                            value={stats.totalReps}
                        />
                        <StatCard
                            icon="⚖️"
                            label="Avg Weight"
                            value={stats.averageWeight}
                            unit="kg"
                        />
                        <StatCard
                            icon="💪"
                            label="Heaviest Lift"
                            value={stats.heaviestWeight}
                            unit="kg"
                        />
                        <StatCard
                            icon="📈"
                            label="Avg Reps/Set"
                            value={stats.averageRepsPerSet}
                        />
                        <StatCard
                            icon="📅"
                            label="Last Workout"
                            value={stats.lastWorkoutDate}
                        />
                        <StatCard
                            icon="🔥"
                            label="Current Streak"
                            value={stats.streakDays}
                            unit="days"
                        />
                    </div>


                </>
            )}
        </div>
    );
}
