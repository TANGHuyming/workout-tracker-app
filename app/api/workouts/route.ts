import { NextRequest, NextResponse } from 'next/server';
import { WorkoutProvider } from '../../providers/WorkoutProvider';

// GET all workouts for authenticated user
export async function GET(request: NextRequest) {
    try {
        const payload = JSON.parse(request.headers.get('jwt-payload') as string);

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
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}

// POST create new workout
export async function POST(request: NextRequest) {
    try {
        const payload = JSON.parse(request.headers.get('jwt-payload') as string);

        const body = await request.json();

        // Validate required fields
        if (!body.name || body.sets === undefined || body.reps === undefined || body.weight === undefined) {
            let response: any = NextResponse.json(
                { success: false, message: 'Missing required fields: name, sets, reps, weight' },
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
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}