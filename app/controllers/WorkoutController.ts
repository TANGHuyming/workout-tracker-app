import { NextRequest, NextResponse } from "next/server";
import { WorkoutProvider } from "@/app/providers/WorkoutProvider";
import { getJwtPayload } from "./AuthController";
export const indexByUserId = async (request: NextRequest) => {
  try {
    const jwtPayloadHeader = request.headers.get("jwt-payload");

    if (!jwtPayloadHeader) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No JWT payload" },
        { status: 401 },
      );
    }

    const payload = getJwtPayload(request);

    if (payload.success) {
      throw new Error(`${payload.message}`);
    }

    // Fetch workouts for user
    const workouts = await WorkoutProvider.findByUserId(payload.userId);

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
