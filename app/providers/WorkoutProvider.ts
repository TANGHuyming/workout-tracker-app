import { connectDB } from "@/app/lib/mongodb";
import WorkoutModel, { IWorkout } from "@/app/models/Workout";
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

      const workouts = await WorkoutModel.find({ userId })
        .populate("userId")
        .sort({ date: -1 });
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findByPage(
    userId: string,
    options: {
      page: number;
      pageSize: number;
    },
  ) {
    try {
      await connectDB();

      if (!userId || userId.length === 0) {
        throw new Error("User id is required");
      }

      if (!options.page && !options.pageSize) {
        throw new Error("Page number and page size are required to paginate");
      }

      if (![10, 25, 50, 100].includes(options.pageSize)) {
        throw new Error("Page size must be 10, 25, 50, 100");
      }

      if (options.page <= 0) {
        throw new Error("Page number cannot be less than 1");
      }

      const pageOffset = (options.page - 1) * options.pageSize;

      const query = WorkoutModel.find({ userId })
        .populate("userId")
        .limit(options.pageSize)
        .skip(pageOffset);

      const workouts = await query;

      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findByFilter(
    userId: string,
    options: {
      date: { startDate: Date; endDate: Date };
      searchQuery: string;
      minimum: number;
      page: number;
      pageSize: number;
    },
  ) {
    try {
      await connectDB();

      if (!userId || userId.length === 0) {
        throw new Error("User id is required");
      }

      if (!options.page && !options.pageSize) {
        throw new Error("Page number and page size are required to paginate");
      }

      if (![10, 25, 50, 100].includes(options.pageSize)) {
        throw new Error("Page size must be 10, 25, 50, 100");
      }

      if (options.page <= 0) {
        throw new Error("Page number cannot be less than 1");
      }

      const pageOffset = (options.page - 1) * options.pageSize;

      const filter: any = {
        userId,
        date: {
          $gte: new Date(0),
          $lte: new Date(),
        },
        name: {
          $regex: "",
          $options: "i",
        },
        weight: {
          $gte: 0,
        },
      };

      // filter by date attribute
      if (options.date.startDate && options.date.endDate) {
        // Remove time component
        const startDate = new Date(options.date.startDate);
        startDate.setHours(0, 0, 0, 0);
        const endDate = new Date(options.date.endDate);
        endDate.setHours(0, 0, 0, 0);
        filter.date.$gte = startDate;
        filter.date.$lte = endDate;
      } else if (!options.date.startDate && options.date.endDate) {
        const endDate = new Date(options.date.endDate);
        endDate.setHours(0, 0, 0, 0);
        filter.date.$lte = endDate;
      } else if (!options.date.endDate && options.date.startDate) {
        const startDate = new Date(options.date.startDate);
        startDate.setHours(0, 0, 0, 0);
        filter.date.$gte = startDate;
      }

      // filter by name searching
      if (options.searchQuery) {
        filter.name.$regex = options.searchQuery.trim();
      }

      // filter by minimum weight
      if (options.minimum) {
        filter.weight.$gte = options.minimum;
      }

      const workouts = await WorkoutModel.aggregate([
        {
          // find by filters
          $match: {
            userId: new (require("mongodb").ObjectId)(filter.userId),
            date: { $gte: filter.date.$gte, $lte: filter.date.$lte },
            name: {
              $regex: filter.name.$regex,
              $options: filter.name.$options,
            },
            weight: {
              $gte: filter.weight.$gte,
            },
          },
        },
        // sort by date
        {
          $sort: {
            date: -1,
          },
        },
        // return array = [metadata: {}, data: {}]
        // metadata contains the count of the filtered collection
        // data contains paginated collection
        {
          $facet: {
            metadata: [{ $count: "count" }],
            data: [{ $skip: pageOffset }, { $limit: options.pageSize }],
          },
        },
      ]);
      return workouts;
    } catch (error) {
      throw error;
    }
  }

  static async findStats(userId: string) {
    try {
      await connectDB();

      const stats = await WorkoutModel.aggregate([
        { $match: { userId: new (require("mongodb").ObjectId)(userId) } },
        {
          $facet: {
            totalWorkouts: [{ $count: "totalWorkouts" }],
            otherStats: [
              {
                $group: {
                  _id: null,
                  totalSets: { $sum: "$sets" },
                  totalReps: { $sum: { $multiply: ["$reps", "$sets"] } },
                  heaviestWeight: { $max: "$weight" },
                  averageWeight: { $avg: "$weight" },
                  lastWorkoutDate: { $max: "$date" },
                },
              },
              {
                $project: {
                  _id: 0,
                  totalSets: "$totalSets",
                  totalReps: "$totalReps",
                  heaviestWeight: "$heaviestWeight",
                  averageWeight: "$averageWeight",
                  averageRepsPerSet: { $divide: ["$totalReps", "$totalSets"] },
                  lastWorkoutData: "$lastWorkoutDate",
                },
              },
            ],
          },
        },
      ]);

      return stats;
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

  static async findBySearch(
    userId: string,
    searchQuery: string,
  ): Promise<IWorkout[]> {
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

  static async findByMininum(
    userId: string,
    minimum: number,
  ): Promise<IWorkout[]> {
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
      const workouts = await WorkoutModel.find()
        .populate("userId")
        .sort({ date: -1 });
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
      const workout = await WorkoutModel.findByIdAndUpdate(
        workoutId,
        updateData,
        {
          new: true,
          runValidators: true,
        },
      ).populate("userId");
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
  static async findRecentByUserId(
    userId: string,
    days: number,
  ): Promise<IWorkout[]> {
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
