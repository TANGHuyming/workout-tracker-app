import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '../../../utils/jwt';
import { UserProvider } from '../../../providers/UserProvider';

export async function GET(request: NextRequest) {
    try {
        // Get token from headers
        const token = getTokenFromRequest(request) || request.cookies.get('authToken')?.value;

        if (!token) {
            let response: any = NextResponse.json(
                { success: false, message: 'No token provided' },
                { status: 401 }
            );
            return response;
        }

        // Verify token
        const payload = verifyToken(token);
        if (!payload) {
            let response: any = NextResponse.json(
                { success: false, message: 'Invalid token' },
                { status: 401 }
            );
            return response;
        }

        // Get user
        const user = await UserProvider.findById(payload.userId);
        if (!user) {
            let response: any = NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
            return response;
        }

        let response: any = NextResponse.json(
            {
                success: true,
                user: {
                    id: user._id.toString(),
                    email: user.email,
                    username: user.username,
                    createdAt: user.createdAt,
                },
            },
            { status: 200 }
        );
        return response;
    } catch (error) {
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}