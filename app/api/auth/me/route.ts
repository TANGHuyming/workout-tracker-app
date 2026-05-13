import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from '../../../utils/jwt';
import { UserProvider } from '../../../providers/UserProvider';

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