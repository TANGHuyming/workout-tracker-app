import { ProfilePayload } from "@/app/utils/profileData";
import { NextRequest, NextResponse } from "next/server";
import { UserProvider } from "@/app/providers/UserProvider"

export async function PUT(request: NextRequest) {
    try {
        const body = (await request.json()) as ProfilePayload;
        const jwtPayloadHeader = request.headers.get('jwt-payload');
        if (!jwtPayloadHeader) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No JWT payload' },
                { status: 401 }
            );
        }
        
        const payload = JSON.parse(jwtPayloadHeader);
        
        // Validation
        if (!body.email || !body.username) {
            let response: any = NextResponse.json(
            { success: false, message: 'All fields are required' },
            { status: 400 }
            );
            return response;
        }

        // Find user
        console.log("Finding user")
        const user = await UserProvider.findById(payload.userId);
        if (!user) {
            let response: any = NextResponse.json(
                { success: false, message: 'User not found' },
                { status: 404 }
            );
            return response;
        }

        // Update user
        const updatedUser = await UserProvider.update(payload.userId, body);
        if (!updatedUser) {
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
    }
    catch(err) {
        let response: any = NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
        return response;
    }
}