import { WorkoutProvider } from "@/app/providers/WorkoutProvider";

export const indexStats = async (userId: string) => {
  try {
    const stats = await WorkoutProvider.findStats(userId);
    const totalWorkouts = stats[0].totalWorkouts[0].totalWorkouts;
    const otherStats = stats[0].otherStats[0];

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      stats: {
        totalWorkouts,
        ...otherStats,
      },
    };

    return data;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};
export const indexByUserId = async (userId: string) => {
  try {
    const workouts = await WorkoutProvider.findByUserId(userId);

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      workouts: workouts.map((w) => ({
        id: w._id,
        name: w.name,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        bodyweight: w.bodyweight,
        date: w.date,
        notes: w.notes,
      })),
    };

    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};

export const indexByAll = async (
  userId: string,
  date: {
    startDate: Date;
    endDate: Date;
  },
  searchQuery: string,
  minimum: number,
  page: number,
  pageSize: number,
) => {
  try {
    const workouts = await WorkoutProvider.findByFilter(userId, {
      date: { startDate: date.startDate, endDate: date.endDate },
      searchQuery: searchQuery,
      minimum: minimum,
      page: page,
      pageSize: pageSize,
    });

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      workouts: workouts[0].data.map((w: any) => ({
        id: w._id,
        name: w.name,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        bodyweight: w.bodyweight,
        date: w.date,
        notes: w.notes,
      })),
      workoutCount: workouts[0].metadata[0]?.count ?? 0,
    };

    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};

export const indexByDate = async (userId: string, date: Date) => {
  try {
    const workouts = await WorkoutProvider.findByDate(userId, {
      date: date,
      sortBy: "date",
    });

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      workouts: workouts.map((w) => ({
        id: w._id,
        name: w.name,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        bodyweight: w.bodyweight,
        date: w.date,
        notes: w.notes,
      })),
    };

    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};

export const indexBySearch = async (userId: string, searchQuery: any) => {
  try {
    const workouts = await WorkoutProvider.findBySearch(userId, searchQuery);

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      workouts: workouts.map((w) => ({
        id: w._id,
        name: w.name,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        bodyweight: w.bodyweight,
        date: w.date,
        notes: w.notes,
      })),
    };

    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};

export const indexByMininum = async (userId: string, minimum: number) => {
  try {
    const workouts = await WorkoutProvider.findByMininum(userId, minimum);

    let data: any = {
      success: true,
      message: "Workouts fetched successfully",
      workouts: workouts.map((w) => ({
        id: w._id,
        name: w.name,
        sets: w.sets,
        reps: w.reps,
        weight: w.weight,
        bodyweight: w.bodyweight,
        date: w.date,
        notes: w.notes,
      })),
    };

    return data;
  } catch (error) {
    console.error("Error fetching workouts:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let data: any = { success: false, message: `Error: ${errorMsg}` };
    return data;
  }
};
