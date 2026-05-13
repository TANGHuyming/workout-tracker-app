import mongoose, { Schema, Document, ObjectId } from 'mongoose';

export interface IWorkout extends Document {
  userId: ObjectId;
  name: string;
  type: 'strength' | 'cardio' | 'flexibility' | 'sports';
  sets: number;
  reps: number;
  weight: number;
  bodyweight: number;
  intensity: 'low' | 'medium' | 'high';
  date: Date;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

const WorkoutSchema = new Schema<IWorkout>(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'User ID is required'],
    },
    name: {
      type: String,
      required: [true, 'Please provide an exercise name'],
      maxlength: [100, 'Exercise name cannot exceed 100 characters'],
    },
    type: {
      type: String,
      enum: ['strength', 'cardio', 'flexibility', 'sports'],
      default: 'strength',
    },
    sets: {
      type: Number,
      required: [true, 'Please provide number of sets'],
      min: [1, 'Sets must be at least 1'],
      max: [100, 'Sets cannot exceed 100'],
    },
    reps: {
      type: Number,
      required: [true, 'Please provide number of reps'],
      min: [1, 'Reps must be at least 1'],
      max: [1000, 'Reps cannot exceed 1000'],
    },
    weight: {
      type: Number,
      required: [true, 'Please provide weight'],
      min: [0, 'Weight cannot be negative'],
    },
    bodyweight: {
      type: Number,
      required: [true, 'Please provide bodyweight'],
      min: [20, 'Bodyweight must be at least 20 kg'],
      max: [300, 'Bodyweight cannot exceed 300 kg'],
    },
    intensity: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium',
    },
    date: {
      type: Date,
      default: Date.now,
    },
    notes: {
      type: String,
      maxlength: [500, 'Notes cannot exceed 500 characters'],
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Workout || mongoose.model<IWorkout>('Workout', WorkoutSchema);
