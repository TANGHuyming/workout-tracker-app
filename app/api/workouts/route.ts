import { NextRequest, NextResponse } from 'next/server';
import { WorkoutProvider } from '../../providers/WorkoutProvider';

// GET all workouts for authenticated user
export async function GET(request: NextRequest) {
    try {
        const jwtPayloadHeader = request.headers.get('jwt-payload');
        if (!jwtPayloadHeader) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No JWT payload' },
                { status: 401 }
            );
        }
        
        const payload = JSON.parse(jwtPayloadHeader);

        // Fetch workouts for user
        const workouts = await WorkoutProvider.findByUserId(payload.userId);

        let response: any = NextResponse.json(
            {
                success: true,
                workouts: workouts.map((w) => ({
                    id: w._id.toString(),
                    userId: w.userId.toString(),
                    name: w.name,
                    type: w.type,
                    sets: w.sets,
                    reps: w.reps,
                    weight: w.weight,
                    bodyweight: w.bodyweight,
                    intensity: w.intensity,
                    date: w.date,
                    notes: w.notes,
                    createdAt: w.createdAt,
                    updatedAt: w.updatedAt,
                })),
            },
            { status: 200 }
        );
        return response;
    } catch (error) {
        console.error('Error fetching workouts:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        let response: any = NextResponse.json(
            { success: false, message: `Error: ${errorMsg}` },
            { status: 500 }
        );
        return response;
    }
}

// POST create new workout
export async function POST(request: NextRequest) {
    try {
        const jwtPayloadHeader = request.headers.get('jwt-payload');
        if (!jwtPayloadHeader) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No JWT payload' },
                { status: 401 }
            );
        }
        
        const payload = JSON.parse(jwtPayloadHeader);

        const body = await request.json();

        // Validate required fields
        if (!body.name || body.sets === undefined || body.reps === undefined || body.weight === undefined || body.bodyweight === undefined) {
            let response: any = NextResponse.json(
                { success: false, message: 'Missing required fields: name, sets, reps, weight, bodyweight' },
                { status: 400 }
            );
            return response;
        }

        // Create workout
        const workout = await WorkoutProvider.create({
            userId: payload.userId,
            name: body.name,
            type: body.type || 'strength',
            sets: body.sets,
            reps: body.reps,
            weight: body.weight,
            bodyweight: body.bodyweight,
            intensity: body.intensity || 'medium',
            date: body.date ? new Date(body.date) : new Date(),
            notes: body.notes || '',
        });

        let response: any = NextResponse.json(
            {
                success: true,
                message: 'Workout created successfully',
                workout: {
                    id: workout._id.toString(),
                    userId: workout.userId.toString(),
                    name: workout.name,
                    type: workout.type,
                    sets: workout.sets,
                    reps: workout.reps,
                    weight: workout.weight,
                    bodyweight: workout.bodyweight,
                    intensity: workout.intensity,
                    date: workout.date,
                    notes: workout.notes,
                    createdAt: workout.createdAt,
                    updatedAt: workout.updatedAt,
                },
            },
            { status: 201 }
        );
        return response;
    } catch (error) {
        console.error('Error creating workout:', error);
        const errorMsg = error instanceof Error ? error.message : 'Unknown error';
        let response: any = NextResponse.json(
            { success: false, message: `Error: ${errorMsg}` },
            { status: 500 }
        );
        return response;
    }
}