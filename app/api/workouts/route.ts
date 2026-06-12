import { NextRequest, NextResponse } from "next/server";
import { WorkoutProvider } from "../../providers/WorkoutProvider";
import csrf from "csrf";
import { cookies } from "next/headers";
import {
  indexByUserId,
  indexByDate,
  indexBySearch,
  indexByMininum,
} from "@/app/controllers/WorkoutController";
import { getJwtPayload } from "@/app/controllers/AuthController";

const csrfProtection = new csrf();
const secret = process.env.CSRF_SECRET || "your-super-secret-key-change-in-production";

// GET all workouts for authenticated user
export async function GET(request: NextRequest) {
  const params = request.nextUrl.searchParams;
  const date = params.get("date");
  const searchQuery = params.get("searchQuery");
  const minimum = parseFloat(params.get("minimum") || "0");
  let data;
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

  if (date) data = await indexByDate(payload.userId, new Date(date));
  else if (searchQuery) data = await indexBySearch(payload.userId, searchQuery);
  else if (minimum) data = await indexByMininum(payload.userId, minimum);
  else data = await indexByUserId(payload.userId);

  if (!data.success) {
    return NextResponse.json({ message: "Failed to fetch workouts" }, { status: 400 });
  }
  return NextResponse.json(
    {
      message: "Successfully fetched workouts",
      workouts: data.workouts,
    },
    {
      status: 200,
    },
  );
}

// POST create new workout
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrfToken")?.value || "";
    const jwtPayloadHeader = request.headers.get("jwt-payload") || "{}";
    const payload = JSON.parse(jwtPayloadHeader);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No JWT payload" },
        { status: 401 },
      );
    }

    if (!csrfProtection.verify(secret, csrfToken)) {
      let response: any = NextResponse.json(
        { success: false, message: "Unauthorized: Invalid CSRF token" },
        { status: 403 },
      );
      return response;
    }

    const body = await request.json();

    // Validate required fields
    if (
      !body.name ||
      body.sets === undefined ||
      body.reps === undefined ||
      body.weight === undefined ||
      body.bodyweight === undefined
    ) {
      let response: any = NextResponse.json(
        {
          success: false,
          message: "Missing required fields: name, sets, reps, weight, bodyweight",
        },
        { status: 400 },
      );
      return response;
    }

    // Create workout
    const workout = await WorkoutProvider.create({
      userId: payload.userId,
      name: body.name,
      sets: body.sets,
      reps: body.reps,
      weight: body.weight,
      bodyweight: body.bodyweight,
      date: body.date ? new Date(body.date) : new Date(),
      notes: body.notes || "",
    });

    let response: any = NextResponse.json(
      {
        success: true,
        message: "Workout created successfully",
        workout: {
          id: workout._id.toString(),
          userId: workout.userId.toString(),
          name: workout.name,
          sets: workout.sets,
          reps: workout.reps,
          weight: workout.weight,
          bodyweight: workout.bodyweight,
          date: workout.date,
          notes: workout.notes,
          createdAt: workout.createdAt,
          updatedAt: workout.updatedAt,
        },
      },
      { status: 201 },
    );

    return response;
  } catch (error) {
    console.error("Error creating workout:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let response: any = NextResponse.json(
      { success: false, message: `Error: ${errorMsg}` },
      { status: 500 },
    );
    return response;
  }
}

// PUT update workout
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const id = body.id;
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrfToken")?.value || "";
    const jwtPayloadHeader = request.headers.get("jwt-payload") || "{}";
    const payload = JSON.parse(jwtPayloadHeader);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No JWT payload" },
        { status: 401 },
      );
    }

    if (!csrfProtection.verify(secret, csrfToken)) {
      let response: any = NextResponse.json(
        { success: false, message: "Unauthorized: Invalid CSRF token" },
        { status: 403 },
      );
      return response;
    }

    // Check if user owns this workout
    const existingWorkout = await WorkoutProvider.findById(id);
    if (!existingWorkout) {
      let response: any = NextResponse.json(
        { success: false, message: "Workout not found" },
        { status: 404 },
      );
      return response;
    }

    if (existingWorkout.userId.toString() !== payload.userId) {
      let response: any = NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
      return response;
    }

    // Update only provided fields
    const updateData: any = {};
    if (body.name !== undefined) updateData.name = body.name;
    if (body.sets !== undefined) updateData.sets = body.sets;
    if (body.reps !== undefined) updateData.reps = body.reps;
    if (body.weight !== undefined) updateData.weight = body.weight;
    if (body.bodyweight !== undefined) updateData.bodyweight = body.bodyweight;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.notes !== undefined) updateData.notes = body.notes;

    const updatedWorkout = await WorkoutProvider.update(id, updateData);

    if (!updatedWorkout) {
      let response: any = NextResponse.json(
        { success: false, message: "Failed to update workout" },
        { status: 500 },
      );
      return response;
    }

    let response: any = NextResponse.json(
      {
        success: true,
        message: "Workout updated successfully",
        workout: {
          id: updatedWorkout._id.toString(),
          userId: updatedWorkout.userId.toString(),
          name: updatedWorkout.name,
          sets: updatedWorkout.sets,
          reps: updatedWorkout.reps,
          weight: updatedWorkout.weight,
          bodyweight: updatedWorkout.bodyweight,
          date: updatedWorkout.date,
          notes: updatedWorkout.notes,
          createdAt: updatedWorkout.createdAt,
          updatedAt: updatedWorkout.updatedAt,
        },
      },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error("Error updating workout:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let response: any = NextResponse.json(
      { success: false, message: `Error: ${errorMsg}` },
      { status: 500 },
    );
    return response;
  }
}

// DELETE workout
export async function DELETE(request: NextRequest) {
  try {
    const { id } = await request.json();
    const cookieStore = await cookies();
    const csrfToken = cookieStore.get("csrfToken")?.value || "";
    const jwtPayloadHeader = request.headers.get("jwt-payload") || "{}";
    const payload = JSON.parse(jwtPayloadHeader);

    if (!payload) {
      return NextResponse.json(
        { success: false, message: "Unauthorized: No JWT payload" },
        { status: 401 },
      );
    }

    if (!csrfProtection.verify(secret, csrfToken)) {
      let response: any = NextResponse.json(
        { success: false, message: "Unauthorized: Invalid CSRF token" },
        { status: 403 },
      );
      return response;
    }

    // Check if user owns this workout
    const existingWorkout = await WorkoutProvider.findById(id);
    if (!existingWorkout) {
      let response: any = NextResponse.json(
        { success: false, message: "Workout not found" },
        { status: 404 },
      );
      return response;
    }

    if (existingWorkout.userId.toString() !== payload.userId) {
      let response: any = NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 403 },
      );
      return response;
    }

    await WorkoutProvider.delete(id);

    let response: any = NextResponse.json(
      { success: true, message: "Workout deleted successfully" },
      { status: 200 },
    );

    return response;
  } catch (error) {
    console.error("Error deleting workout:", error);
    const errorMsg = error instanceof Error ? error.message : "Unknown error";
    let response: any = NextResponse.json(
      { success: false, message: `Error: ${errorMsg}` },
      { status: 500 },
    );
    return response;
  }
}
