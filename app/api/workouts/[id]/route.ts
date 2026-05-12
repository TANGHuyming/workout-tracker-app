import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '../../../utils/jwt';
import { WorkoutProvider } from '../../../providers/WorkoutProvider';

interface RouteParams {
    params: Promise<{
        id: string;
    }>;
}

// GET single workout by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        
        const payload = JSON.parse(request.headers.get('jwt-payload') as string);

        const workout = await WorkoutProvider.findById(id);

        if (!workout) {
            let response: any = NextResponse.json(
                { success: false, message: 'Workout not found' },
                { status: 404 }
            );
            return response;
        }

        // Check if user owns this workout
        if (workout.userId.toString() !== payload.userId) {
            let response: any = NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 403 }
            );
            return response;
        }

        let response: any = NextResponse.json(
            {
                success: true,
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
            { status: 200 }
        );
        return response;
    } catch (error) {
        console.error('Error fetching workout:', error);
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}

// PUT update workout
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        
        const payload = JSON.parse(request.headers.get('jwt-payload') as string);

        // Check if user owns this workout
        const existingWorkout = await WorkoutProvider.findById(id);
        if (!existingWorkout) {
            let response: any = NextResponse.json(
                { success: false, message: 'Workout not found' },
                { status: 404 }
            );
            return response;
        }

        if (existingWorkout.userId.toString() !== payload.userId) {
            let response: any = NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 403 }
            );
            return response;
        }

        const body = await request.json();

        // Update only provided fields
        const updateData: any = {};
        if (body.name !== undefined) updateData.name = body.name;
        if (body.type !== undefined) updateData.type = body.type;
        if (body.sets !== undefined) updateData.sets = body.sets;
        if (body.reps !== undefined) updateData.reps = body.reps;
        if (body.weight !== undefined) updateData.weight = body.weight;
        if (body.intensity !== undefined) updateData.intensity = body.intensity;
        if (body.date !== undefined) updateData.date = new Date(body.date);
        if (body.notes !== undefined) updateData.notes = body.notes;

        const updatedWorkout = await WorkoutProvider.update(id, updateData);

        if (!updatedWorkout) {
            let response: any = NextResponse.json(
                { success: false, message: 'Failed to update workout' },
                { status: 500 }
            );
            return response;
        }

        let response: any = NextResponse.json(
            {
                success: true,
                message: 'Workout updated successfully',
                workout: {
                    id: updatedWorkout._id.toString(),
                    userId: updatedWorkout.userId.toString(),
                    name: updatedWorkout.name,
                    type: updatedWorkout.type,
                    sets: updatedWorkout.sets,
                    reps: updatedWorkout.reps,
                    weight: updatedWorkout.weight,
                    intensity: updatedWorkout.intensity,
                    date: updatedWorkout.date,
                    notes: updatedWorkout.notes,
                    createdAt: updatedWorkout.createdAt,
                    updatedAt: updatedWorkout.updatedAt,
                },
            },
            { status: 200 }
        );
        return response;
    } catch (error) {
        console.error('Error updating workout:', error);
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}

// DELETE workout
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        const { id } = await params;
        
        const payload = JSON.parse(request.headers.get('jwt-payload') as string);

        // Check if user owns this workout
        const existingWorkout = await WorkoutProvider.findById(id);
        if (!existingWorkout) {
            let response: any = NextResponse.json(
                { success: false, message: 'Workout not found' },
                { status: 404 }
            );
            return response;
        }

        if (existingWorkout.userId.toString() !== payload.userId) {
            let response: any = NextResponse.json(
                { success: false, message: 'Unauthorized' },
                { status: 403 }
            );
            return response;
        }

        await WorkoutProvider.delete(id);

        let response: any = NextResponse.json(
            { success: true, message: 'Workout deleted successfully' },
            { status: 200 }
        );
        return response;
    } catch (error) {
        console.error('Error deleting workout:', error);
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}
