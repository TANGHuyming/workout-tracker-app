import { WorkoutProvider } from "@/app/providers/WorkoutProvider";

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
  date: Date,
  searchQuery: string,
  minimum: number,
) => {
  try {
    const workouts = await WorkoutProvider.findByFilter(userId, {
      date: date,
      searchQuery,
      minimum,
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
