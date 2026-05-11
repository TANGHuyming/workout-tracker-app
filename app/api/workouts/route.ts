import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '../../utils/jwt';
import { WorkoutProvider } from '../../providers/WorkoutProvider';

// GET all workouts for authenticated user
export async function GET(request: NextRequest) {
    try {
        // Get token from headers or cookies
        const token = getTokenFromRequest(request) || request.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        // Fetch workouts for user
        const workouts = await WorkoutProvider.findByUserId(payload.userId);

        return NextResponse.json(
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
    } catch (error) {
        console.error('Error fetching workouts:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST create new workout
export async function POST(request: NextRequest) {
    try {
        // Get token from headers or cookies
        const token = getTokenFromRequest(request) || request.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload || !payload.userId) {
            return NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
        }

        const body = await request.json();

        // Validate required fields
        if (!body.name || body.sets === undefined || body.reps === undefined || body.weight === undefined) {
            return NextResponse.json(
                { success: false, message: 'Missing required fields: name, sets, reps, weight' },
                { status: 400 }
            );
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

        return NextResponse.json(
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
    } catch (error) {
        console.error('Error creating workout:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
