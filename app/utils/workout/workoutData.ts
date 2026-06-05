export interface Workout {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number; // in lbs or kg
  bodyweight: number; // in kg
  date: Date;
  notes?: string;
}

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  averageWeight: number;
  heaviestWeight: number;
  averageRepsPerSet: number;
  lastWorkoutDate: string;
  streakDays: number;
}

export const calculateStats = (workouts: Workout[]): WorkoutStats => {
  if (workouts.length === 0) {
    return {
      totalWorkouts: 0,
      totalSets: 0,
      totalReps: 0,
      averageWeight: 0,
      heaviestWeight: 0,
      averageRepsPerSet: 0,
      lastWorkoutDate: 'N/A',
      streakDays: 0,
    };
  }

  const totalWorkouts = workouts.length;
  const totalSets = workouts.reduce((sum, w) => sum + w.sets, 0);
  const totalReps = workouts.reduce((sum, w) => sum + (w.reps * w.sets), 0);
  const averageRepsPerSet = Math.round(totalReps / totalSets);
  
  // Calculate average weight (weighted by sets)
  const totalSetReps = workouts.reduce((sum, w) => sum + w.sets, 0);
  const weightedSum = workouts.reduce((sum, w) => sum + (w.weight * w.sets), 0);
  const averageWeight = totalSetReps > 0 ? Math.round(weightedSum / totalSetReps) : 0;
  
  // Find heaviest weight
  const heaviestWeight = Math.max(...workouts.map((w) => w.weight), 0);

  const lastWorkout = workouts.sort((a, b) => b.date.getTime() - a.date.getTime())[0];
  const lastWorkoutDate = lastWorkout.date.toLocaleDateString();

  // Calculate streak (consecutive days with workouts)
  const sortedByDate = workouts.sort((a, b) => b.date.getTime() - a.date.getTime());
  let streakDays = 1;
  for (let i = 0; i < sortedByDate.length - 1; i++) {
    const current = new Date(sortedByDate[i].date);
    const next = new Date(sortedByDate[i + 1].date);
    const diffTime = current.getTime() - next.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      streakDays++;
    } else {
      break;
    }
  }

  return {
    totalWorkouts,
    totalSets,
    totalReps,
    averageWeight,
    heaviestWeight,
    averageRepsPerSet,
    lastWorkoutDate,
    streakDays,
  };
};
