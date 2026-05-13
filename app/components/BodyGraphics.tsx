'use client';

import type { Workout } from '../utils/workoutData';
import { getMuscleGroupsForExercise, getMuscleGroupDisplayName, getStrengthThresholdsForExercise, type MuscleGroup } from '../utils/exercises';

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
    bodyweight: number;
    exerciseName: string;
    ratio: number;
}

interface MuscleGroupStrength extends ExerciseStrength {
    muscleGroup: MuscleGroup;
}

export default function BodyGraphics({ workouts }: BodyGraphicsProps) {
    // Get max weight for each muscle group
    const getMuscleGroupStats = (): Map<MuscleGroup, MuscleGroupStrength | null> => {
        const muscleGroupMap = new Map<MuscleGroup, MuscleGroupStrength | null>();
        const allMuscleGroups: MuscleGroup[] = [
            'chest', 'back', 'lats', 'biceps', 'triceps', 'forearms', 
            'shoulders', 'traps', 'abs', 'obliques', 'glutes', 'quads', 
            'hamstrings', 'calves', 'lower_back'
        ];

        allMuscleGroups.forEach((group) => {
            const exercises = workouts.filter((w) => {
                const muscleGroups = getMuscleGroupsForExercise(w.name);
                return muscleGroups.includes(group);
            });

            if (exercises.length === 0) {
                muscleGroupMap.set(group, null);
            } else {
                const maxExercise = exercises.reduce((prev, current) =>
                    prev.weight > current.weight ? prev : current
                );

                const ratio = maxExercise.bodyweight > 0 ? maxExercise.weight / maxExercise.bodyweight : 0;

                muscleGroupMap.set(group, {
                    muscleGroup: group,
                    maxWeight: maxExercise.weight,
                    bodyweight: maxExercise.bodyweight,
                    exerciseName: maxExercise.name,
                    ratio: ratio,
                });
            }
        });

        return muscleGroupMap;
    };

    // Get strength level based on exercise-specific weight thresholds
    const getStrengthLevel = (weight: number | null, bodyweight: number | null, exerciseName: string | null): StrengthLevel => {
        if (weight === null || bodyweight === null || bodyweight === 0 || exerciseName === null) return 'gray';
        
        const thresholds = getStrengthThresholdsForExercise(exerciseName);
        const ratio = weight / bodyweight;
        
        if (ratio < thresholds.gray) return 'gray';
        if (ratio < thresholds.green) return 'gray';
        if (ratio < thresholds.yellow) return 'green';
        if (ratio < thresholds.orange) return 'yellow';
        if (ratio < thresholds.red) return 'orange';
        return 'red';
    };

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

    const muscleGroupStats = getMuscleGroupStats();
    
    // Get primary muscle groups for SVG coloring
    const chest = muscleGroupStats.get('chest');
    const back = muscleGroupStats.get('back');
    const lats = muscleGroupStats.get('lats');
    const biceps = muscleGroupStats.get('biceps');
    const triceps = muscleGroupStats.get('triceps');
    const shoulders = muscleGroupStats.get('shoulders');
    const quads = muscleGroupStats.get('quads');
    const hamstrings = muscleGroupStats.get('hamstrings');
    const glutes = muscleGroupStats.get('glutes');
    const abs = muscleGroupStats.get('abs');
    const traps = muscleGroupStats.get('traps');

    const chestLevel = getStrengthLevel(chest?.maxWeight ?? null, chest?.bodyweight ?? null, chest?.exerciseName ?? null);
    const backLevel = getStrengthLevel(back?.maxWeight ?? null, back?.bodyweight ?? null, back?.exerciseName ?? null);
    const latsLevel = getStrengthLevel(lats?.maxWeight ?? null, lats?.bodyweight ?? null, lats?.exerciseName ?? null);
    const bicepsLevel = getStrengthLevel(biceps?.maxWeight ?? null, biceps?.bodyweight ?? null, biceps?.exerciseName ?? null);
    const tricepsLevel = getStrengthLevel(triceps?.maxWeight ?? null, triceps?.bodyweight ?? null, triceps?.exerciseName ?? null);
    const shouldersLevel = getStrengthLevel(shoulders?.maxWeight ?? null, shoulders?.bodyweight ?? null, shoulders?.exerciseName ?? null);
    const quadsLevel = getStrengthLevel(quads?.maxWeight ?? null, quads?.bodyweight ?? null, quads?.exerciseName ?? null);
    const hamsLevel = getStrengthLevel(hamstrings?.maxWeight ?? null, hamstrings?.bodyweight ?? null, hamstrings?.exerciseName ?? null);
    const glutesLevel = getStrengthLevel(glutes?.maxWeight ?? null, glutes?.bodyweight ?? null, glutes?.exerciseName ?? null);
    const absLevel = getStrengthLevel(abs?.maxWeight ?? null, abs?.bodyweight ?? null, abs?.exerciseName ?? null);
    const trapsLevel = getStrengthLevel(traps?.maxWeight ?? null, traps?.bodyweight ?? null, traps?.exerciseName ?? null);

    return (
        <div className="bg-white dark:bg-zinc-900 p-6 rounded-lg shadow-md border border-zinc-200 dark:border-zinc-800">
            <h2 className="text-2xl font-bold mb-2 text-black dark:text-white">Strength Profile</h2>
            <p className="text-sm text-zinc-600 dark:text-zinc-400 mb-6">
                Track strength levels across 15 major muscle groups
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

                        {/* Traps - shoulders top back */}
                        <ellipse
                            cx="100"
                            cy="110"
                            rx="45"
                            ry="20"
                            fill={strengthColors[trapsLevel]}
                            opacity="0.75"
                        />

                        {/* Torso/Chest - colored based on chest strength */}
                        <ellipse
                            cx="100"
                            cy="150"
                            rx="35"
                            ry="45"
                            fill={strengthColors[chestLevel]}
                            opacity="0.85"
                        />

                        {/* Back/Lats - colored based on back/lats strength */}
                        <ellipse
                            cx="100"
                            cy="170"
                            rx="32"
                            ry="40"
                            fill={strengthColors[latsLevel]}
                            opacity="0.7"
                        />

                        {/* Abs - core area */}
                        <rect
                            x="90"
                            y="145"
                            width="20"
                            height="40"
                            fill={strengthColors[absLevel]}
                            opacity="0.6"
                        />

                        {/* Left Arm - Bicep and Tricep */}
                        <g opacity="0.85">
                            <line
                                x1="65"
                                y1="130"
                                x2="30"
                                y2="180"
                                stroke={strengthColors[bicepsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            <line
                                x1="65"
                                y1="135"
                                x2="25"
                                y2="190"
                                stroke={strengthColors[tricepsLevel]}
                                strokeWidth="10"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                            {/* Left Hand */}
                            <circle cx="25" cy="185" r="8" fill={strengthColors[bicepsLevel]} />
                        </g>

                        {/* Right Arm - Bicep and Tricep */}
                        <g opacity="0.85">
                            <line
                                x1="135"
                                y1="130"
                                x2="170"
                                y2="180"
                                stroke={strengthColors[bicepsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                            />
                            <line
                                x1="135"
                                y1="135"
                                x2="175"
                                y2="190"
                                stroke={strengthColors[tricepsLevel]}
                                strokeWidth="10"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                            {/* Right Hand */}
                            <circle cx="175" cy="185" r="8" fill={strengthColors[bicepsLevel]} />
                        </g>

                        {/* Shoulders - colored separately */}
                        <g opacity="0.8">
                            <circle
                                cx="65"
                                cy="125"
                                r="12"
                                fill={strengthColors[shouldersLevel]}
                            />
                            <circle
                                cx="135"
                                cy="125"
                                r="12"
                                fill={strengthColors[shouldersLevel]}
                            />
                        </g>

                        {/* Left Leg - Quads and Hamstrings */}
                        <g opacity="0.85">
                            <line
                                x1="85"
                                y1="235"
                                x2="75"
                                y2="330"
                                stroke={strengthColors[quadsLevel]}
                                strokeWidth="14"
                                strokeLinecap="round"
                            />
                            <line
                                x1="90"
                                y1="240"
                                x2="80"
                                y2="335"
                                stroke={strengthColors[hamsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                            {/* Left Foot */}
                            <rect x="65" y="330" width="20" height="10" fill={strengthColors[quadsLevel]} />
                        </g>

                        {/* Right Leg - Quads and Hamstrings */}
                        <g opacity="0.85">
                            <line
                                x1="115"
                                y1="235"
                                x2="125"
                                y2="330"
                                stroke={strengthColors[quadsLevel]}
                                strokeWidth="14"
                                strokeLinecap="round"
                            />
                            <line
                                x1="110"
                                y1="240"
                                x2="120"
                                y2="335"
                                stroke={strengthColors[hamsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.7"
                            />
                            {/* Right Foot */}
                            <rect x="115" y="330" width="20" height="10" fill={strengthColors[quadsLevel]} />
                        </g>

                        {/* Glutes - lower back/hip area */}
                        <g opacity="0.7">
                            <ellipse
                                cx="85"
                                cy="240"
                                rx="12"
                                ry="15"
                                fill={strengthColors[glutesLevel]}
                            />
                            <ellipse
                                cx="115"
                                cy="240"
                                rx="12"
                                ry="15"
                                fill={strengthColors[glutesLevel]}
                            />
                        </g>
                    </svg>
                </div>

                {/* Strength Details Grid */}
                <div className="space-y-3 overflow-y-auto max-h-96">
                    {Array.from(muscleGroupStats.entries()).map(([group, stats]) => {
                        const level = getStrengthLevel(stats?.maxWeight ?? null, stats?.bodyweight ?? null, stats?.exerciseName ?? null);
                        return (
                            <div
                                key={group}
                                className="p-3 border border-zinc-200 dark:border-zinc-700 rounded-lg hover:border-zinc-300 dark:hover:border-zinc-600 transition-colors"
                            >
                                <div className="flex items-center gap-2 mb-1">
                                    <div
                                        className="w-4 h-4 rounded"
                                        style={{ backgroundColor: strengthColors[level] }}
                                    />
                                    <h3 className="font-semibold text-sm text-black dark:text-white">
                                        {getMuscleGroupDisplayName(group)}
                                    </h3>
                                </div>
                                <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-1">
                                    {getLevelLabel(level)}
                                </p>
                                {stats ? (
                                    <div className="space-y-0.5">
                                        <p className="text-xs font-medium text-black dark:text-white">
                                            {stats.exerciseName}
                                        </p>
                                        <p className="text-sm font-bold text-black dark:text-white">
                                            {stats.maxWeight} kg @ {stats.bodyweight} kg BW
                                        </p>
                                        <p className="text-xs text-zinc-500 dark:text-zinc-400">
                                            Ratio: {stats.ratio.toFixed(2)}x bodyweight
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-zinc-500 dark:text-zinc-400 italic">
                                        No exercises logged
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* Legend */}
                    <div className="pt-3 border-t border-zinc-200 dark:border-zinc-700 mt-3">
                        <p className="text-xs font-semibold text-zinc-600 dark:text-zinc-400 mb-2 uppercase">
                            Strength Levels
                        </p>
                        <p className="text-xs text-zinc-600 dark:text-zinc-400 mb-3">
                            Based on bodyweight ratios (like GymRank)
                        </p>
                        <div className="space-y-1 text-xs">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.gray }}
                                />
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Untrained
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.green }}
                                />
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Beginner
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.yellow }}
                                />
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Intermediate
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.orange }}
                                />
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Advanced
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded"
                                    style={{ backgroundColor: strengthColors.red }}
                                />
                                <span className="text-zinc-600 dark:text-zinc-400">
                                    Elite
                                </span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
