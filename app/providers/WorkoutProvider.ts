import { connectDB } from "../lib/mongodb";
import WorkoutModel, { IWorkout } from "../models/Workout";
import { ObjectId } from "mongodb";

export class WorkoutProvider {
  /**
   * Create a new workout
   */
  static async create(workoutData: {
    userId: string | ObjectId;
    name: string;
    sets: number;
    reps: number;
    weight: number;
    bodyweight: number;
    date?: Date;
    notes?: string;
  }): Promise<IWorkout> {
    try {
      await connectDB();
      const workout = await WorkoutModel.create(workoutData);
      return workout.populate("userId");
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find workout by ID
   */
  static async findById(workoutId: string): Promise<IWorkout | null> {
    try {
      await connectDB();
      const workout = await WorkoutModel.findById(workoutId);
      return workout;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all workouts for a user
   */
  static async findByUserId(userId: string): Promise<IWorkout[]> {
    try {
      await connectDB();
      const workouts = await WorkoutModel.find({ userId }).populate("userId").sort({ date: -1 });
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findByFilter(
    userId: string,
    options: {
      date: Date;
      searchQuery: string;
      minimum: number;
    },
  ) {
    try {
      await connectDB();

      const filter: any = {
        userId,
        createdAt: {
          $gte: new Date(0),
          $lt: new Date(),
        },
        name: {
          $regex: "",
          $options: "i",
        },
        weight: {
          $gte: 0,
        },
      };

      if (options.date) {
        // Remove time component
        const startDate = new Date(options.date);
        startDate.setHours(0, 0, 0, 0);
        filter.createdAt.$gte = startDate;
      }
      if (options.searchQuery) {
        filter.name.$regex = options.searchQuery.trim();
      }
      if (options.minimum) {
        filter.weight.$gte = options.minimum;
      }

      const query = WorkoutModel.find(filter).populate("userId");
      const workouts = await query;
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all workouts for a user with filtering and sorting
   */
  static async findByDate(
    userId: string,
    options: {
      date: Date;
      sortBy: "date" | "weight" | "sets";
    },
  ): Promise<IWorkout[]> {
    try {
      await connectDB();

      const filter: any = {
        userId,
        createdAt: {
          $gte: "",
          $lt: "",
        },
      };

      if (options.date) {
        // Remove time component
        const startDate = new Date(options.date);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 1);
        filter.createdAt.$gte = startDate;
        filter.createdAt.$lt = endDate;
      }

      let query = WorkoutModel.find(filter).populate("userId");

      // Sort options
      if (options?.sortBy === "weight") {
        query = query.sort({ weight: -1 });
      } else if (options?.sortBy === "sets") {
        query = query.sort({ sets: -1 });
      } else {
        query = query.sort({ date: -1 });
      }

      const workouts = await query;
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findBySearch(userId: string, searchQuery: string): Promise<IWorkout[]> {
    try {
      const filter: any = {
        userId,
        name: { $regex: searchQuery, $options: "i" },
      };
      await connectDB();
      const query = WorkoutModel.find(filter).populate("userId");
      const workouts = await query;
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findByMininum(userId: string, minimum: number): Promise<IWorkout[]> {
    try {
      const filter: any = {
        userId,
        weight: { $gte: minimum },
      };
      await connectDB();
      const query = WorkoutModel.find(filter).populate("userId");
      const workouts = await query;
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all workouts (admin only)
   */
  static async findAll(): Promise<IWorkout[]> {
    try {
      await connectDB();
      const workouts = await WorkoutModel.find().populate("userId").sort({ date: -1 });
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update workout
   */
  static async update(
    workoutId: string,
    updateData: Partial<{
      name?: string;
      sets?: number;
      reps?: number;
      weight?: number;
      date?: Date;
      notes?: string;
    }>,
  ): Promise<IWorkout | null> {
    try {
      await connectDB();
      const workout = await WorkoutModel.findByIdAndUpdate(workoutId, updateData, {
        new: true,
        runValidators: true,
      }).populate("userId");
      return workout;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete workout
   */
  static async delete(workoutId: string): Promise<IWorkout | null> {
    try {
      await connectDB();
      const workout = await WorkoutModel.findByIdAndDelete(workoutId);
      return workout;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Delete all workouts for a user
   */
  static async deleteAllByUserId(userId: string): Promise<any> {
    try {
      await connectDB();
      const result = await WorkoutModel.deleteMany({ userId });
      return result;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get workout count for a user
   */
  static async countByUserId(userId: string): Promise<number> {
    try {
      await connectDB();
      const count = await WorkoutModel.countDocuments({ userId });
      return count;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get workouts from last N days for a user
   */
  static async findRecentByUserId(userId: string, days: number): Promise<IWorkout[]> {
    try {
      await connectDB();
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - days);

      const workouts = await WorkoutModel.find({
        userId,
        date: { $gte: startDate },
      })
        .populate("userId")
        .sort({ date: -1 });

      return workouts;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get aggregate statistics for a user
   */
  static async getStatsByUserId(userId: string): Promise<any> {
    try {
      await connectDB();

      const stats = await WorkoutModel.aggregate([
        { $match: { userId: new (require("mongodb").ObjectId)(userId) } },
        {
          $group: {
            _id: null,
            totalWorkouts: { $sum: 1 },
            totalSets: { $sum: "$sets" },
            totalReps: { $sum: "$reps" },
            averageWeight: { $avg: "$weight" },
            maxWeight: { $max: "$weight" },
            averageRepsPerSet: { $avg: { $divide: ["$reps", "$sets"] } },
          },
        },
      ]);

      return {
        overall: stats[0] || {
          totalWorkouts: 0,
          totalSets: 0,
          totalReps: 0,
          averageWeight: 0,
          maxWeight: 0,
          averageRepsPerSet: 0,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
