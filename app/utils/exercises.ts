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

  // Cardio
  { name: 'Treadmill Running', type: 'cardio' },
  { name: 'Stationary Bike', type: 'cardio' },
  { name: 'Elliptical Machine', type: 'cardio' },
  { name: 'Rowing Machine', type: 'cardio' },
  { name: 'Stair Climber', type: 'cardio' },
  { name: 'Jump Rope', type: 'cardio' },
  { name: 'Swimming', type: 'cardio' },
  { name: 'Running', type: 'cardio' },
  { name: 'Cycling', type: 'cardio' },
  { name: 'HIIT Training', type: 'cardio' },

  // Flexibility
  { name: 'Yoga', type: 'flexibility' },
  { name: 'Pilates', type: 'flexibility' },
  { name: 'Static Stretching', type: 'flexibility' },
  { name: 'Dynamic Stretching', type: 'flexibility' },
  { name: 'Tai Chi', type: 'flexibility' },

  // Sports
  { name: 'Basketball', type: 'sports' },
  { name: 'Soccer', type: 'sports' },
  { name: 'Tennis', type: 'sports' },
  { name: 'Boxing', type: 'sports' },
  { name: 'Mixed Martial Arts', type: 'sports' },
  { name: 'Rock Climbing', type: 'sports' },
  { name: 'CrossFit', type: 'sports' },
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
 * Thresholds in kg for each strength level: gray < green < yellow < orange < red
 */
export interface StrengthThresholds {
  gray: number;      // Untrained
  green: number;     // Beginner
  yellow: number;    // Intermediate
  orange: number;    // Advanced
  red: number;       // Elite (anything at or above this is elite)
}

export const STRENGTH_STANDARDS: Record<string, StrengthThresholds> = {
  // Compound Lifts - Heavy (Barbell)
  'Deadlifts': { gray: 60, green: 100, yellow: 160, orange: 220, red: 300 },
  'Squats': { gray: 40, green: 80, yellow: 140, orange: 200, red: 280 },
  'Barbell Row': { gray: 30, green: 70, yellow: 120, orange: 170, red: 240 },
  'Hack Squats': { gray: 40, green: 80, yellow: 140, orange: 200, red: 280 },
  'Smith Machine Squats': { gray: 40, green: 80, yellow: 140, orange: 200, red: 280 },
  'Leg Press': { gray: 80, green: 180, yellow: 320, orange: 450, red: 600 },
  
  // Bench Pressing Variants
  'Bench Press': { gray: 20, green: 60, yellow: 100, orange: 140, red: 200 },
  'Incline Bench Press': { gray: 15, green: 50, yellow: 90, orange: 130, red: 180 },
  'Dumbbell Bench Press': { gray: 10, green: 30, yellow: 55, orange: 85, red: 120 },
  'Cable Chest Press': { gray: 15, green: 45, yellow: 80, orange: 120, red: 170 },
  'Machine Chest Press': { gray: 20, green: 60, yellow: 100, orange: 140, red: 200 },
  'Push-ups': { gray: 5, green: 20, yellow: 50, orange: 100, red: 150 },

  // Pulling Exercises
  'Pull-ups': { gray: 0, green: 5, yellow: 12, orange: 25, red: 40 },
  'Assisted Pull-ups': { gray: 20, green: 50, yellow: 80, orange: 110, red: 150 },
  'Lat Pulldown': { gray: 20, green: 60, yellow: 100, orange: 140, red: 200 },
  'Seated Row': { gray: 25, green: 65, yellow: 110, orange: 160, red: 220 },
  'Cable Row': { gray: 25, green: 65, yellow: 110, orange: 160, red: 220 },
  'Lat Pullover': { gray: 15, green: 45, yellow: 80, orange: 120, red: 170 },

  // Leg Exercises - Isolation
  'Leg Curl': { gray: 15, green: 50, yellow: 90, orange: 130, red: 180 },
  'Leg Extension': { gray: 15, green: 50, yellow: 90, orange: 130, red: 180 },
  'Lunges': { gray: 10, green: 30, yellow: 60, orange: 100, red: 150 },
  'Bulgarian Split Squats': { gray: 10, green: 30, yellow: 60, orange: 100, red: 150 },
  'Calf Raises': { gray: 30, green: 80, yellow: 150, orange: 220, red: 320 },
  'Leg Press Calf Raises': { gray: 60, green: 150, yellow: 270, orange: 400, red: 550 },

  // Arm Exercises - Curls
  'Barbell Curl': { gray: 10, green: 25, yellow: 45, orange: 70, red: 100 },
  'Dumbbell Curl': { gray: 5, green: 12, yellow: 22, orange: 35, red: 55 },
  'Cable Curl': { gray: 8, green: 20, yellow: 40, orange: 65, red: 95 },
  'Hammer Curl': { gray: 6, green: 15, yellow: 30, orange: 50, red: 75 },
  'Concentration Curl': { gray: 4, green: 10, yellow: 20, orange: 35, red: 55 },

  // Arm Exercises - Triceps
  'Tricep Dips': { gray: 0, green: 10, yellow: 25, orange: 50, red: 80 },
  'Tricep Rope Pulldown': { gray: 10, green: 30, yellow: 60, orange: 95, red: 140 },
  'Tricep Extension': { gray: 6, green: 18, yellow: 38, orange: 65, red: 100 },
  'Overhead Tricep Extension': { gray: 6, green: 18, yellow: 38, orange: 65, red: 100 },
  'Skull Crushers': { gray: 8, green: 20, yellow: 45, orange: 75, red: 115 },

  // Shoulder Exercises
  'Military Press': { gray: 12, green: 30, yellow: 55, orange: 85, red: 120 },
  'Shoulder Press': { gray: 12, green: 30, yellow: 55, orange: 85, red: 120 },
  'Dumbbell Press': { gray: 6, green: 18, yellow: 35, orange: 60, red: 90 },
  'Lateral Raise': { gray: 4, green: 10, yellow: 18, orange: 28, red: 42 },
  'Front Raise': { gray: 4, green: 10, yellow: 18, orange: 28, red: 42 },
  'Reverse Peck Deck': { gray: 10, green: 30, yellow: 55, orange: 85, red: 120 },
  'Upright Row': { gray: 10, green: 25, yellow: 50, orange: 80, red: 120 },
  'Shrugs': { gray: 20, green: 60, yellow: 120, orange: 200, red: 300 },

  // Core Exercises
  'Crunches': { gray: 0, green: 10, yellow: 25, orange: 50, red: 100 },
  'Ab Wheel Rollout': { gray: 0, green: 5, yellow: 15, orange: 35, red: 60 },
  'Hanging Leg Raises': { gray: 0, green: 5, yellow: 15, orange: 35, red: 60 },
  'Cable Woodchops': { gray: 8, green: 20, yellow: 45, orange: 80, red: 120 },
  'Planks': { gray: 15, green: 45, yellow: 90, orange: 180, red: 300 },
  'Russian Twists': { gray: 4, green: 12, yellow: 25, orange: 50, red: 90 },

  // Dumbbell Flye
  'Dumbbell Flye': { gray: 4, green: 10, yellow: 20, orange: 35, red: 55 },
  'Dumbbell Rows': { gray: 8, green: 20, yellow: 40, orange: 65, red: 100 },

  // Default for unknown exercises
};

/**
 * Get strength thresholds for a specific exercise
 */
export const getStrengthThresholdsForExercise = (exerciseName: string): StrengthThresholds => {
  // Return specific thresholds if found, otherwise return default thresholds
  return STRENGTH_STANDARDS[exerciseName] || { gray: 30, green: 75, yellow: 150, orange: 250, red: 350 };
};
