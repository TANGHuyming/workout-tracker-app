'use client';

import type { Workout } from '../utils/workoutData';

interface BodyGraphicsProps {
    workouts: Workout[];
}

type StrengthLevel = 'gray' | 'green' | 'yellow' | 'orange' | 'red';

interface StrengthColorMap {
    gray: string;
    green: string;
    yellow: string;
    orange: string;
    red: string;
}

const strengthColors: StrengthColorMap = {
    gray: '#9CA3AF',
    green: '#10B981',
    yellow: '#FBBF24',
    orange: '#F97316',
    red: '#EF4444',
};

const darkStrengthColors: StrengthColorMap = {
    gray: '#6B7280',
    green: '#059669',
    yellow: '#D97706',
    orange: '#EA580C',
    red: '#DC2626',
};

interface ExerciseStrength {
    maxWeight: number;
    exerciseName: string;
}

export default function BodyGraphics({ workouts }: BodyGraphicsProps) {
    // Find max weight for different exercise categories
    const getMaxForPattern = (pattern: string[]): ExerciseStrength | null => {
        const matches = workouts.filter((w) =>
            pattern.some((p) => w.name.toLowerCase().includes(p.toLowerCase()))
        );

        if (matches.length === 0) return null;

        const max = matches.reduce((prev, current) =>
            prev.weight > current.weight ? prev : current
        );

        return {
            maxWeight: max.weight,
            exerciseName: max.name,
        };
    };

    // Find max weights for different muscle groups
    const chest = getMaxForPattern(['bench', 'press', 'dumbbell press', 'chest']);
    const back = getMaxForPattern(['row', 'deadlift', 'pull', 'lat']);
    const legs = getMaxForPattern(['squat', 'leg', 'lunge']);
    const arms = getMaxForPattern(['curl', 'tricep', 'arm']);

    // Get strength level based on weight
    const getStrengthLevel = (weight: number | null): StrengthLevel => {
        if (weight === null) return 'gray';
        if (weight < 50) return 'gray';
        if (weight < 100) return 'green';
        if (weight < 200) return 'yellow';
        if (weight < 300) return 'orange';
        return 'red';
    };

    const chestLevel = getStrengthLevel(chest?.maxWeight ?? null);
    const backLevel = getStrengthLevel(back?.maxWeight ?? null);
    const legsLevel = getStrengthLevel(legs?.maxWeight ?? null);
    const armsLevel = getStrengthLevel(arms?.maxWeight ?? null);

    const getLevelLabel = (level: StrengthLevel): string => {
        const labels: Record<StrengthLevel, string> = {
            gray: 'Untrained',
            green: 'Beginner',
            yellow: 'Intermediate',
            orange: 'Advanced',
            red: 'Elite',
        };
        return labels[level];
    };

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Strength Profile</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Color indicates your strength level based on maximum lifts
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Body Graphics SVG */}
                <div className="flex justify-center items-center">
                    <svg
                        viewBox="0 0 200 400"
                        className="w-48 h-96"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    >
                        {/* Head */}
                        <circle cx="100" cy="50" r="25" fill={strengthColors.gray} />

                        {/* Neck */}
                        <line x1="100" y1="75" x2="100" y2="100" stroke={strengthColors.gray} strokeWidth="8" />

                        {/* Torso/Chest - colored based on chest strength */}
                        <ellipse
                            cx="100"
                            cy="150"
                            rx="35"
                            ry="45"
                            fill={strengthColors[chestLevel]}
                            opacity="0.85"
                        />

                        {/* Back - colored based on back strength */}
                        <ellipse
                            cx="100"
                            cy="170"
                            rx="32"
                            ry="40"
                            fill={strengthColors[backLevel]}
                            opacity="0.7"
                        />

                        {/* Left Arm */}
                        <g opacity="0.85">
                            <line
                                x1="65"
                                y1="130"
                                x2="30"
                                y2="180"
                                stroke={strengthColors[armsLevel]}
                                strokeWidth="16"
                                strokeLinecap="round"
                            />
                            {/* Left Hand */}
                            <circle cx="25" cy="185" r="8" fill={strengthColors[armsLevel]} />
                        </g>

                        {/* Right Arm */}
                        <g opacity="0.85">
                            <line
                                x1="135"
                                y1="130"
                                x2="170"
                                y2="180"
                                stroke={strengthColors[armsLevel]}
                                strokeWidth="16"
                                strokeLinecap="round"
                            />
                            {/* Right Hand */}
                            <circle cx="175" cy="185" r="8" fill={strengthColors[armsLevel]} />
                        </g>

                        {/* Left Leg */}
                        <g opacity="0.85">
                            <line
                                x1="85"
                                y1="235"
                                x2="75"
                                y2="330"
                                stroke={strengthColors[legsLevel]}
                                strokeWidth="18"
                                strokeLinecap="round"
                            />
                            {/* Left Foot */}
                            <rect x="65" y="330" width="20" height="10" fill={strengthColors[legsLevel]} />
                        </g>

                        {/* Right Leg */}
                        <g opacity="0.85">
                            <line
                                x1="115"
                                y1="235"
                                x2="125"
                                y2="330"
                                stroke={strengthColors[legsLevel]}
                                strokeWidth="18"
                                strokeLinecap="round"
                            />
                            {/* Right Foot */}
                            <rect x="115" y="330" width="20" height="10" fill={strengthColors[legsLevel]} />
                        </g>
                    </svg>
                </div>

                {/* Strength Details */}
                <div className="space-y-4">
                    {/* Chest */}
                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: strengthColors[chestLevel] }}
                            />
                            <h3 className="font-semibold text-black dark:text-white">Chest</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {getLevelLabel(chestLevel)}
                        </p>
                        {chest ? (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {chest.exerciseName}
                                </p>
                                <p className="text-xl font-bold text-black dark:text-white">
                                    {chest.maxWeight} kg
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                                No chest exercises logged
                            </p>
                        )}
                    </div>

                    {/* Back */}
                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: strengthColors[backLevel] }}
                            />
                            <h3 className="font-semibold text-black dark:text-white">Back</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {getLevelLabel(backLevel)}
                        </p>
                        {back ? (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {back.exerciseName}
                                </p>
                                <p className="text-xl font-bold text-black dark:text-white">
                                    {back.maxWeight} kg
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                                No back exercises logged
                            </p>
                        )}
                    </div>

                    {/* Legs */}
                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: strengthColors[legsLevel] }}
                            />
                            <h3 className="font-semibold text-black dark:text-white">Legs</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {getLevelLabel(legsLevel)}
                        </p>
                        {legs ? (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {legs.exerciseName}
                                </p>
                                <p className="text-xl font-bold text-black dark:text-white">
                                    {legs.maxWeight} kg
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                                No leg exercises logged
                            </p>
                        )}
                    </div>

                    {/* Arms */}
                    <div className="p-4 border border-zinc-200 dark:border-zinc-700 rounded-lg">
                        <div className="flex items-center gap-3 mb-2">
                            <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: strengthColors[armsLevel] }}
                            />
                            <h3 className="font-semibold text-black dark:text-white">Arms</h3>
                        </div>
                        <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-2">
                            {getLevelLabel(armsLevel)}
                        </p>
                        {arms ? (
                            <div className="space-y-1">
                                <p className="text-sm font-medium text-black dark:text-white">
                                    {arms.exerciseName}
                                </p>
                                <p className="text-xl font-bold text-black dark:text-white">
                                    {arms.maxWeight} kg
                                </p>
                            </div>
                        ) : (
                            <p className="text-sm text-zinc-500 dark:text-zinc-400 italic">
                                No arm exercises logged
                            </p>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="pt-4 border-t border-zinc-200 dark:border-zinc-700">
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-3 uppercase">
                            Strength Levels
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.gray }}
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Untrained (&lt;50 kg)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.green }}
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Beginner (50-100 kg)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.yellow }}
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Intermediate (100-200 kg)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.orange }}
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Advanced (200-300 kg)
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.red }}
                                />
                                <span className="text-xs text-zinc-600 dark:text-zinc-400">
                                    Elite (300+ kg)
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
