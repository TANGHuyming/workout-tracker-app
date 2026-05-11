export interface ExerciseOption {
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
}

export const EXERCISE_DATABASE: ExerciseOption[] = [
  // Strength - Upper Body (Chest)
  { name: 'Bench Press', type: 'strength' },
  { name: 'Incline Bench Press', type: 'strength' },
  { name: 'Dumbbell Bench Press', type: 'strength' },
  { name: 'Dumbbell Flye', type: 'strength' },
  { name: 'Cable Chest Press', type: 'strength' },
  { name: 'Machine Chest Press', type: 'strength' },
  { name: 'Push-ups', type: 'strength' },

  // Strength - Back
  { name: 'Deadlifts', type: 'strength' },
  { name: 'Barbell Row', type: 'strength' },
  { name: 'Dumbbell Rows', type: 'strength' },
  { name: 'Lat Pulldown', type: 'strength' },
  { name: 'Pull-ups', type: 'strength' },
  { name: 'Assisted Pull-ups', type: 'strength' },
  { name: 'Lat Pullover', type: 'strength' },
  { name: 'Seated Row', type: 'strength' },
  { name: 'Cable Row', type: 'strength' },

  // Strength - Legs
  { name: 'Squats', type: 'strength' },
  { name: 'Leg Press', type: 'strength' },
  { name: 'Leg Curl', type: 'strength' },
  { name: 'Leg Extension', type: 'strength' },
  { name: 'Lunges', type: 'strength' },
  { name: 'Bulgarian Split Squats', type: 'strength' },
  { name: 'Hack Squats', type: 'strength' },
  { name: 'Smith Machine Squats', type: 'strength' },
  { name: 'Calf Raises', type: 'strength' },
  { name: 'Leg Press Calf Raises', type: 'strength' },

  // Strength - Arms
  { name: 'Barbell Curl', type: 'strength' },
  { name: 'Dumbbell Curl', type: 'strength' },
  { name: 'Cable Curl', type: 'strength' },
  { name: 'Hammer Curl', type: 'strength' },
  { name: 'Concentration Curl', type: 'strength' },
  { name: 'Tricep Dips', type: 'strength' },
  { name: 'Tricep Rope Pulldown', type: 'strength' },
  { name: 'Tricep Extension', type: 'strength' },
  { name: 'Overhead Tricep Extension', type: 'strength' },
  { name: 'Skull Crushers', type: 'strength' },

  // Strength - Shoulders
  { name: 'Military Press', type: 'strength' },
  { name: 'Shoulder Press', type: 'strength' },
  { name: 'Dumbbell Press', type: 'strength' },
  { name: 'Lateral Raise', type: 'strength' },
  { name: 'Front Raise', type: 'strength' },
  { name: 'Reverse Peck Deck', type: 'strength' },
  { name: 'Upright Row', type: 'strength' },
  { name: 'Shrugs', type: 'strength' },

  // Strength - Core
  { name: 'Crunches', type: 'strength' },
  { name: 'Ab Wheel Rollout', type: 'strength' },
  { name: 'Hanging Leg Raises', type: 'strength' },
  { name: 'Cable Woodchops', type: 'strength' },
  { name: 'Planks', type: 'strength' },
  { name: 'Russian Twists', type: 'strength' },

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
