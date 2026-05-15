export type MuscleGroup = 
  | 'chest'
  | 'back'
  | 'lats'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'shoulders'
  | 'traps'
  | 'abs'
  | 'obliques'
  | 'glutes'
  | 'quads'
  | 'hamstrings'
  | 'calves'
  | 'lower_back';

export interface ExerciseOption {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
  muscleGroups?: MuscleGroup[];
}

export const EXERCISE_DATABASE: ExerciseOption[] = [
  // Strength - Upper Body (Chest)
  { name: 'Bench Press', type: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'] },
  { name: 'Incline Bench Press', type: 'strength', muscleGroups: ['chest', 'shoulders', 'triceps'] },
  { name: 'Dumbbell Bench Press', type: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'] },
  { name: 'Dumbbell Flye', type: 'strength', muscleGroups: ['chest', 'shoulders'] },
  { name: 'Cable Chest Press', type: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'] },
  { name: 'Machine Chest Press', type: 'strength', muscleGroups: ['chest', 'triceps'] },
  { name: 'Push-ups', type: 'strength', muscleGroups: ['chest', 'triceps', 'shoulders'] },

  // Strength - Back
  { name: 'Deadlifts', type: 'strength', muscleGroups: ['back', 'glutes', 'hamstrings', 'lower_back', 'traps'] },
  { name: 'Barbell Row', type: 'strength', muscleGroups: ['back', 'biceps', 'lats', 'traps'] },
  { name: 'Dumbbell Rows', type: 'strength', muscleGroups: ['back', 'biceps', 'lats'] },
  { name: 'Lat Pulldown', type: 'strength', muscleGroups: ['lats', 'biceps', 'back'] },
  { name: 'Pull-ups', type: 'strength', muscleGroups: ['lats', 'back', 'biceps'] },
  { name: 'Assisted Pull-ups', type: 'strength', muscleGroups: ['lats', 'back', 'biceps'] },
  { name: 'Lat Pullover', type: 'strength', muscleGroups: ['lats', 'chest', 'back'] },
  { name: 'Seated Row', type: 'strength', muscleGroups: ['back', 'biceps', 'lats'] },
  { name: 'Cable Row', type: 'strength', muscleGroups: ['back', 'biceps', 'lats'] },

  // Strength - Legs
  { name: 'Squats', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Leg Press', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Leg Curl', type: 'strength', muscleGroups: ['hamstrings'] },
  { name: 'Leg Extension', type: 'strength', muscleGroups: ['quads'] },
  { name: 'Lunges', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Bulgarian Split Squats', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Hack Squats', type: 'strength', muscleGroups: ['quads', 'glutes'] },
  { name: 'Smith Machine Squats', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },
  { name: 'Calf Raises', type: 'strength', muscleGroups: ['calves'] },
  { name: 'Leg Press Calf Raises', type: 'strength', muscleGroups: ['calves'] },
  { name: 'Hip Thrust', type: 'strength', muscleGroups: ['glutes', 'hamstrings'] },
  { name: 'Power Clean', type: 'strength', muscleGroups: ['quads', 'glutes', 'hamstrings'] },

  // Strength - Arms
  { name: 'Barbell Curl', type: 'strength', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Dumbbell Curl', type: 'strength', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Cable Curl', type: 'strength', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Hammer Curl', type: 'strength', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Concentration Curl', type: 'strength', muscleGroups: ['biceps', 'forearms'] },
  { name: 'Tricep Dips', type: 'strength', muscleGroups: ['triceps', 'chest', 'shoulders'] },
  { name: 'Tricep Rope Pulldown', type: 'strength', muscleGroups: ['triceps', 'forearms'] },
  { name: 'Tricep Extension', type: 'strength', muscleGroups: ['triceps', 'forearms'] },
  { name: 'Overhead Tricep Extension', type: 'strength', muscleGroups: ['triceps', 'shoulders'] },
  { name: 'Skull Crushers', type: 'strength', muscleGroups: ['triceps'] },

  // Strength - Shoulders
  { name: 'Military Press', type: 'strength', muscleGroups: ['shoulders', 'triceps', 'chest'] },
  { name: 'Shoulder Press', type: 'strength', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Dumbbell Press', type: 'strength', muscleGroups: ['shoulders', 'triceps'] },
  { name: 'Lateral Raise', type: 'strength', muscleGroups: ['shoulders'] },
  { name: 'Front Raise', type: 'strength', muscleGroups: ['shoulders'] },
  { name: 'Reverse Peck Deck', type: 'strength', muscleGroups: ['shoulders', 'back'] },
  { name: 'Upright Row', type: 'strength', muscleGroups: ['shoulders', 'traps', 'biceps'] },
  { name: 'Shrugs', type: 'strength', muscleGroups: ['traps', 'shoulders'] },

  // Strength - Core
  { name: 'Crunches', type: 'strength', muscleGroups: ['abs'] },
  { name: 'Ab Wheel Rollout', type: 'strength', muscleGroups: ['abs', 'lower_back'] },
  { name: 'Hanging Leg Raises', type: 'strength', muscleGroups: ['abs'] },
  { name: 'Cable Woodchops', type: 'strength', muscleGroups: ['obliques', 'abs'] },
  { name: 'Planks', type: 'strength', muscleGroups: ['abs', 'lower_back'] },
  { name: 'Russian Twists', type: 'strength', muscleGroups: ['obliques', 'abs'] },
];

/**
 * Get exercises filtered by type
 */
export const getExercisesByType = (type: 'strength' | 'cardio' | 'flexibility' | 'sports'): string[] => {
  return EXERCISE_DATABASE
    .filter((exercise) => exercise.type === type)
    .map((exercise) => exercise.name)
    .sort();
};

/**
 * Get all exercise names
 */
export const getAllExercises = (): string[] => {
  return EXERCISE_DATABASE
    .map((exercise) => exercise.name)
    .sort();
};

/**
 * Get muscle groups targeted by an exercise
 */
export const getMuscleGroupsForExercise = (exerciseName: string): MuscleGroup[] => {
  const exercise = EXERCISE_DATABASE.find((e) => e.name === exerciseName);
  return exercise?.muscleGroups || [];
};

/**
 * Get the primary muscle group for an exercise (first one listed)
 */
export const getPrimaryMuscleGroup = (exerciseName: string): MuscleGroup | null => {
  const groups = getMuscleGroupsForExercise(exerciseName);
  return groups.length > 0 ? groups[0] : null;
};

/**
 * Get display name for a muscle group
 */
export const getMuscleGroupDisplayName = (group: MuscleGroup): string => {
  const displayNames: Record<MuscleGroup, string> = {
    chest: 'Chest',
    back: 'Back',
    lats: 'Lats',
    biceps: 'Biceps',
    triceps: 'Triceps',
    forearms: 'Forearms',
    shoulders: 'Shoulders',
    traps: 'Traps',
    abs: 'Abs',
    obliques: 'Obliques',
    glutes: 'Glutes',
    quads: 'Quads',
    hamstrings: 'Hamstrings',
    calves: 'Calves',
    lower_back: 'Lower Back',
  };
  return displayNames[group];
};

/**
 * Individual strength standards for each exercise
 * Thresholds use bodyweight multiplier ratios for realism
 * Example: Squat at 1.5x bodyweight = 120kg at 80kg BW = Intermediate
 */
export interface StrengthThresholds {
  gray: number;      // Untrained (multiplier)
  green: number;     // Beginner (multiplier)
  yellow: number;    // Intermediate (multiplier)
  orange: number;    // Advanced (multiplier)
  red: number;       // Elite (multiplier, anything at or above this)
}

export const STRENGTH_STANDARDS: Record<string, StrengthThresholds> = {
  // Compound Lifts - Heavy (based on bodyweight ratio)
  'Deadlifts': { gray: 0.75, green: 1.25, yellow: 2.0, orange: 2.75, red: 3.5 },
  'Squats': { gray: 0.5, green: 1.0, yellow: 1.5, orange: 2.25, red: 3.0 },
  'Barbell Row': { gray: 0.4, green: 0.8, yellow: 1.25, orange: 1.75, red: 2.25 },
  'Hack Squats': { gray: 0.5, green: 1.0, yellow: 1.5, orange: 2.25, red: 3.0 },
  'Smith Machine Squats': { gray: 0.5, green: 1.0, yellow: 1.5, orange: 2.25, red: 3.0 },
  'Leg Press': { gray: 1.0, green: 2.0, yellow: 3.5, orange: 5.0, red: 6.5 },
  'Power Clean': { gray: 0.5, green: 0.75, yellow: 1, orange: 1.4, red: 2 },
  
  // Bench Pressing Variants
  'Bench Press': { gray: 0.25, green: 0.5, yellow: 0.75, orange: 1.0, red: 1.35 },
  'Incline Bench Press': { gray: 0.2, green: 0.4, yellow: 0.6, orange: 0.8, red: 1.1 },
  'Dumbbell Bench Press': { gray: 0.15, green: 0.35, yellow: 0.55, orange: 0.75, red: 1.0 },
  'Cable Chest Press': { gray: 0.2, green: 0.45, yellow: 0.7, orange: 1.0, red: 1.3 },
  'Machine Chest Press': { gray: 0.25, green: 0.5, yellow: 0.75, orange: 1.0, red: 1.35 },
  'Push-ups': { gray: 0.2, green: 0.5, yellow: 1.0, orange: 1.5, red: 2.0 },

  // Pulling Exercises
  'Pull-ups': { gray: 0.0, green: 0.1, yellow: 0.2, orange: 0.35, red: 0.5 },
  'Assisted Pull-ups': { gray: 0.2, green: 0.5, yellow: 0.8, orange: 1.1, red: 1.5 },
  'Lat Pulldown': { gray: 0.2, green: 0.5, yellow: 0.8, orange: 1.1, red: 1.5 },
  'Seated Row': { gray: 0.25, green: 0.6, yellow: 0.95, orange: 1.3, red: 1.75 },
  'Cable Row': { gray: 0.25, green: 0.6, yellow: 0.95, orange: 1.3, red: 1.75 },
  'Lat Pullover': { gray: 0.15, green: 0.4, yellow: 0.7, orange: 1.0, red: 1.3 },

  // Leg Exercises - Isolation
  'Leg Curl': { gray: 0.2, green: 0.5, yellow: 0.9, orange: 1.3, red: 1.8 },
  'Leg Extension': { gray: 0.2, green: 0.5, yellow: 0.9, orange: 1.3, red: 1.8 },
  'Lunges': { gray: 0.15, green: 0.35, yellow: 0.65, orange: 1.0, red: 1.5 },
  'Bulgarian Split Squats': { gray: 0.1, green: 0.3, yellow: 0.6, orange: 1.0, red: 1.4 },
  'Calf Raises': { gray: 0.25, green: 0.5, yellow: 1, orange: 1.5, red: 2 },
  'Leg Press Calf Raises': { gray: 0.6, green: 1.5, yellow: 2.7, orange: 4.0, red: 5.5 },

  // Arm Exercises - Curls (dumbbell weight per arm)
  'Barbell Curl': { gray: 0.1, green: 0.25, yellow: 0.45, orange: 0.65, red: 0.9 },
  'Dumbbell Curl': { gray: 0.05, green: 0.15, yellow: 0.28, orange: 0.44, red: 0.65 },
  'Cable Curl': { gray: 0.08, green: 0.2, yellow: 0.38, orange: 0.6, red: 0.85 },
  'Hammer Curl': { gray: 0.06, green: 0.15, yellow: 0.3, orange: 0.5, red: 0.75 },
  'Concentration Curl': { gray: 0.04, green: 0.1, yellow: 0.2, orange: 0.35, red: 0.55 },

  // Arm Exercises - Triceps
  'Tricep Dips': { gray: 0.0, green: 0.1, yellow: 0.25, orange: 0.5, red: 0.8 },
  'Tricep Rope Pulldown': { gray: 0.1, green: 0.3, yellow: 0.6, orange: 0.9, red: 1.3 },
  'Tricep Extension': { gray: 0.06, green: 0.18, yellow: 0.38, orange: 0.65, red: 1.0 },
  'Overhead Tricep Extension': { gray: 0.06, green: 0.18, yellow: 0.38, orange: 0.65, red: 1.0 },
  'Skull Crushers': { gray: 0.08, green: 0.2, yellow: 0.45, orange: 0.75, red: 1.15 },

  // Shoulder Exercises
  'Military Press': { gray: 0.12, green: 0.3, yellow: 0.55, orange: 0.85, red: 1.2 },
  'Shoulder Press': { gray: 0.12, green: 0.3, yellow: 0.55, orange: 0.85, red: 1.2 },
  'Dumbbell Press': { gray: 0.06, green: 0.18, yellow: 0.35, orange: 0.6, red: 0.9 },
  'Lateral Raise': { gray: 0.04, green: 0.1, yellow: 0.18, orange: 0.28, red: 0.42 },
  'Front Raise': { gray: 0.04, green: 0.1, yellow: 0.18, orange: 0.28, red: 0.42 },
  'Reverse Peck Deck': { gray: 0.1, green: 0.3, yellow: 0.55, orange: 0.85, red: 1.2 },
  'Upright Row': { gray: 0.1, green: 0.25, yellow: 0.5, orange: 0.8, red: 1.2 },
  'Shrugs': { gray: 0.2, green: 0.6, yellow: 1.2, orange: 2.0, red: 3.0 },

  // Core Exercises (reps-based, using 0-based scale)
  'Crunches': { gray: 0, green: 0.2, yellow: 0.5, orange: 1.0, red: 2.0 },
  'Ab Wheel Rollout': { gray: 0, green: 0.05, yellow: 0.15, orange: 0.35, red: 0.6 },
  'Hanging Leg Raises': { gray: 0, green: 0.05, yellow: 0.15, orange: 0.35, red: 0.6 },
  'Cable Woodchops': { gray: 0.08, green: 0.2, yellow: 0.45, orange: 0.8, red: 1.2 },
  'Planks': { gray: 0.15, green: 0.45, yellow: 0.9, orange: 1.8, red: 3.0 },
  'Russian Twists': { gray: 0.04, green: 0.12, yellow: 0.25, orange: 0.5, red: 0.9 },

  // Dumbbell Flye
  'Dumbbell Flye': { gray: 0.04, green: 0.1, yellow: 0.2, orange: 0.35, red: 0.55 },
  'Dumbbell Rows': { gray: 0.08, green: 0.2, yellow: 0.4, orange: 0.65, red: 1.0 },

  // Default for unknown exercises (fallback to absolute weight standards)
};

/**
 * Get strength thresholds for a specific exercise
 * Returns multiplier ratios (weight/bodyweight)
 */
export const getStrengthThresholdsForExercise = (exerciseName: string): StrengthThresholds => {
  // Return specific thresholds if found, otherwise return default ratios
  return STRENGTH_STANDARDS[exerciseName] || { gray: 0.5, green: 1, yellow: 1.5, orange: 2, red: 2.5 };
};
