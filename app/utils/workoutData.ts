export interface Workout {
  id: string;
  name: string;
  type: 'cardio' | 'strength' | 'flexibility' | 'sports';
  sets: number;
  reps: number;
  weight: number; // in lbs or kg
  intensity: 'low' | 'medium' | 'high';
  date: Date;
  notes?: string;
}

export const mockWorkouts: Workout[] = [
  {
    id: '1',
    name: 'Bench Press',
    type: 'strength',
    sets: 4,
    reps: 8,
    weight: 225,
    intensity: 'high',
    date: new Date('2026-05-11'),
    notes: 'Great form, felt strong',
  },
  {
    id: '2',
    name: 'Squats',
    type: 'strength',
    sets: 5,
    reps: 5,
    weight: 315,
    intensity: 'high',
    date: new Date('2026-05-10'),
    notes: 'New PR!',
  },
  {
    id: '3',
    name: 'Dumbbell Rows',
    type: 'strength',
    sets: 4,
    reps: 10,
    weight: 90,
    intensity: 'medium',
    date: new Date('2026-05-09'),
  },
  {
    id: '4',
    name: 'Pull-ups',
    type: 'strength',
    sets: 3,
    reps: 12,
    weight: 0,
    intensity: 'high',
    date: new Date('2026-05-08'),
    notes: 'Bodyweight exercise',
  },
  {
    id: '5',
    name: 'Deadlifts',
    type: 'strength',
    sets: 3,
    reps: 6,
    weight: 405,
    intensity: 'high',
    date: new Date('2026-05-07'),
    notes: 'Heavy session',
  },
  {
    id: '6',
    name: 'Leg Press',
    type: 'strength',
    sets: 4,
    reps: 12,
    weight: 450,
    intensity: 'medium',
    date: new Date('2026-05-06'),
  },
];

export interface WorkoutStats {
  totalWorkouts: number;
  totalSets: number;
  totalReps: number;
  averageWeight: number;
  heaviestWeight: number;
  averageRepsPerSet: number;
  workoutsByType: Record<string, number>;
  workoutsByIntensity: Record<string, number>;
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
      workoutsByType: {},
      workoutsByIntensity: {},
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

  const workoutsByType: Record<string, number> = {};
  const workoutsByIntensity: Record<string, number> = {};

  workouts.forEach((w) => {
    workoutsByType[w.type] = (workoutsByType[w.type] || 0) + 1;
    workoutsByIntensity[w.intensity] = (workoutsByIntensity[w.intensity] || 0) + 1;
  });

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
    workoutsByType,
    workoutsByIntensity,
    lastWorkoutDate,
    streakDays,
  };
};

export class WorkoutManager {
  private workouts: Workout[] = [...mockWorkouts];

  getAll(): Workout[] {
    return this.workouts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  add(workout: Omit<Workout, 'id'>): Workout {
    const newWorkout: Workout = {
      ...workout,
      id: Date.now().toString(),
    };
    this.workouts.push(newWorkout);
    return newWorkout;
  }

  update(id: string, updates: Partial<Omit<Workout, 'id'>>): Workout | null {
    const index = this.workouts.findIndex((w) => w.id === id);
    if (index === -1) return null;

    this.workouts[index] = {
      ...this.workouts[index],
      ...updates,
    };
    return this.workouts[index];
  }

  delete(id: string): boolean {
    const index = this.workouts.findIndex((w) => w.id === id);
    if (index === -1) return false;

    this.workouts.splice(index, 1);
    return true;
  }

  getById(id: string): Workout | null {
    return this.workouts.find((w) => w.id === id) || null;
  }

  getStats(): WorkoutStats {
    return calculateStats(this.workouts);
  }

  getRecent(days: number): Workout[] {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    return this.workouts.filter((w) => new Date(w.date) >= cutoffDate);
  }
}

export const workoutManager = new WorkoutManager();
