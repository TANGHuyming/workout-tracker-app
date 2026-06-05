import { ProfilePayload } from "@/app/utils/profileData";
import { NextRequest, NextResponse } from "next/server";
import { UserProvider } from "@/app/providers/UserProvider"
import csrf from 'csrf';

const csrfProtection = new csrf();
const secret = process.env.CSRF_SECRET || 'your-super-secret-key-change-in-production';

export async function GET(request: NextRequest) {
    try {
        let response: any = null;
        const users = await UserProvider.findAll();
        if(!users) {
            response = NextResponse.json(
                {success: false, message: 'No users found'},
                {status: 404}
            );

            return response
        }

        const formattedUsers = users.map(user => ({
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
            updatedAt: user.updatedAt,
        }));
        
        response = NextResponse.json(
            {success: true, users: formattedUsers},
            {status: 200}
        )

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

        const csrfToken = request.headers.get('x-csrf-token') ?? '';
        if (!csrfProtection.verify(secret, csrfToken)) {
            let response: any = NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid CSRF token' },
                { status: 403 }
            );
            return response;
        }
        
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