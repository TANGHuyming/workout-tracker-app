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
    const calves = muscleGroupStats.get('calves');
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
    const calvesLevel = getStrengthLevel(calves?.maxWeight ?? null, calves?.bodyweight ?? null, calves?.exerciseName ?? null);
    const absLevel = getStrengthLevel(abs?.maxWeight ?? null, abs?.bodyweight ?? null, abs?.exerciseName ?? null);
    const trapsLevel = getStrengthLevel(traps?.maxWeight ?? null, traps?.bodyweight ?? null, traps?.exerciseName ?? null);

    return (
        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-800">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                    Strength Profile
                </h2>
                <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
                    Track strength levels across 15 major muscle groups
                </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Body Graphics SVG */}
                <div className="flex justify-center items-center">
                    <svg
                        viewBox="0 0 200 400"
                        className="w-48 h-96"
                        style={{ filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.1))' }}
                    >
                        {/* Head */}
                        <circle cx="100" cy="60" r="25" fill={strengthColors.gray} />

                        {/* Neck */}
                        <line x1="100" y1="85" x2="100" y2="100" stroke={strengthColors.gray} strokeWidth="8" />

                        {/* Traps - shoulders top back */}
                        <ellipse
                            cx="100"
                            cy="110"
                            rx="35"
                            ry="20"
                            fill={strengthColors[trapsLevel]}
                            opacity="0.5"
                        />

                        {/* Torso/Chest - colored based on chest strength */}
                        <ellipse
                            cx="100"
                            cy="140"
                            rx="40"
                            ry="30"
                            fill={strengthColors[chestLevel]}
                            opacity="0.75"
                        />

                        {/* Lats - colored based on lats strength */}
                        <ellipse
                            cx="100"
                            cy="170"
                            rx="32"
                            ry="40"
                            fill={strengthColors[latsLevel]}
                            opacity="0.5"
                        />

                        {/* Back - Back strength */}
                        <rect
                            x="79"
                            y="145"
                            width="40"
                            height="80"
                            fill={strengthColors[backLevel]}
                            opacity="0.5"
                        />

                        {/* Abs - core area */}
                        <rect
                            x="90"
                            y="170"
                            width="20"
                            height="50"
                            fill={strengthColors[absLevel]}
                            opacity="0.75"
                        />

                        {/* Left Arm - Bicep and Tricep */}
                        <g>
                            <line
                                x1="65"
                                y1="130"
                                x2="30"
                                y2="180"
                                stroke={strengthColors[bicepsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <line
                                x1="65"
                                y1="135"
                                x2="25"
                                y2="190"
                                stroke={strengthColors[tricepsLevel]}
                                strokeWidth="10"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                            {/* Left Hand */}
                            <circle cx="25" cy="185" r="8" fill={strengthColors[bicepsLevel]} />
                        </g>

                        {/* Right Arm - Bicep and Tricep */}
                        <g>
                            <line
                                x1="135"
                                y1="130"
                                x2="170"
                                y2="180"
                                stroke={strengthColors[bicepsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <line
                                x1="135"
                                y1="135"
                                x2="175"
                                y2="190"
                                stroke={strengthColors[tricepsLevel]}
                                strokeWidth="10"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                            {/* Right Hand */}
                            <circle cx="175" cy="185" r="8" fill={strengthColors[bicepsLevel]} />
                        </g>

                        {/* Shoulders - colored separately */}
                        <g>
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
                        <g>
                            <line
                                x1="85"
                                y1="235"
                                x2="75"
                                y2="330"
                                stroke={strengthColors[quadsLevel]}
                                strokeWidth="14"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <line
                                x1="90"
                                y1="240"
                                x2="80"
                                y2="335"
                                stroke={strengthColors[hamsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                            {/* Left Foot */}
                            <rect x="65" y="330" width="20" height="10" fill={strengthColors[quadsLevel]} />
                        </g>

                        {/* Right Leg - Quads and Hamstrings */}
                        <g>
                            <line
                                x1="115"
                                y1="235"
                                x2="125"
                                y2="330"
                                stroke={strengthColors[quadsLevel]}
                                strokeWidth="14"
                                strokeLinecap="round"
                                opacity="0.75"
                            />
                            <line
                                x1="110"
                                y1="240"
                                x2="120"
                                y2="335"
                                stroke={strengthColors[hamsLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                            {/* Right Foot */}
                            <rect x="115" y="330" width="20" height="10" fill={strengthColors[quadsLevel]} />
                        </g>

                        {/* Glutes - lower back/hip area */}
                        <g opacity="0.5">
                            <ellipse
                                cx="90"
                                cy="240"
                                rx="12"
                                ry="15"
                                fill={strengthColors[glutesLevel]}
                            />
                            <ellipse
                                cx="110"
                                cy="240"
                                rx="12"
                                ry="15"
                                fill={strengthColors[glutesLevel]}
                            />
                        </g>
                        
                        {/* Left Calves - lower leg area */}
                        <g>
                            <line
                                x1="85"
                                y1="300"
                                x2="80"
                                y2="330"
                                stroke={strengthColors[calvesLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                        </g>
                        
                        {/* Right Calves - lower leg area */}
                        <g>
                            <line
                                x1="115"
                                y1="300"
                                x2="120"
                                y2="330"
                                stroke={strengthColors[calvesLevel]}
                                strokeWidth="12"
                                strokeLinecap="round"
                                opacity="0.5"
                            />
                        </g>
                    </svg>
                </div>

                {/* Strength Details Grid */}
                <div className="space-y-3 overflow-y-auto max-h-96">
                    {Array.from(muscleGroupStats.entries()).map(([group, stats]) => {
                        const level = getStrengthLevel(stats?.maxWeight ?? null, stats?.bodyweight ?? null, stats?.exerciseName ?? null);
                        const colorMap: Record<StrengthLevel, string> = {
                            gray: 'bg-slate-50 dark:bg-slate-900/50 border-slate-200 dark:border-slate-700',
                            green: 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-800',
                            yellow: 'bg-yellow-50 dark:bg-yellow-950/30 border-yellow-200 dark:border-yellow-800',
                            orange: 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-800',
                            red: 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-800',
                        };
                        const textColorMap: Record<StrengthLevel, string> = {
                            gray: 'text-slate-700 dark:text-slate-300',
                            green: 'text-green-700 dark:text-green-300',
                            yellow: 'text-yellow-700 dark:text-yellow-300',
                            orange: 'text-orange-700 dark:text-orange-300',
                            red: 'text-red-700 dark:text-red-300',
                        };
                        return (
                            <div
                                key={group}
                                className={`p-4 border rounded-lg hover:shadow-md transition-all ${colorMap[level]}`}
                            >
                                <div className="flex items-center gap-2 mb-2">
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{ backgroundColor: strengthColors[level] }}
                                    />
                                    <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                                        {getMuscleGroupDisplayName(group)}
                                    </h3>
                                </div>
                                <p className={`text-xs font-semibold mb-2 uppercase tracking-wide ${textColorMap[level]}`}>
                                    {getLevelLabel(level)}
                                </p>
                                {stats ? (
                                    <div className="space-y-1">
                                        <p className="text-xs font-medium text-slate-700 dark:text-slate-300">
                                            {stats.exerciseName}
                                        </p>
                                        <p className="text-sm font-bold text-slate-900 dark:text-white">
                                            {stats.maxWeight} kg @ {stats.bodyweight} kg BW
                                        </p>
                                        <p className="text-xs text-slate-600 dark:text-slate-400">
                                            Ratio: <span className="font-semibold">{stats.ratio.toFixed(2)}x</span>
                                        </p>
                                    </div>
                                ) : (
                                    <p className="text-xs text-slate-500 dark:text-slate-400 italic">
                                        No exercises logged
                                    </p>
                                )}
                            </div>
                        );
                    })}

                    {/* Legend */}
                    <div className="pt-4 border-t border-slate-200 dark:border-slate-700 mt-4">
                        <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1 uppercase tracking-wide">
                            Strength Levels
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mb-3">
                            Based on bodyweight ratios
                        </p>
                        <div className="space-y-2">
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: strengthColors.gray }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Untrained
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: strengthColors.green }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Beginner
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: strengthColors.yellow }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Intermediate
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: strengthColors.orange }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
                                    Advanced
                                </span>
                            </div>
                            <div className="flex items-center gap-2">
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: strengthColors.red }}
                                />
                                <span className="text-xs font-medium text-slate-600 dark:text-slate-400">
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
