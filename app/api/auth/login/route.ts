import { NextRequest, NextResponse } from 'next/server';
import { comparePasswords, type LoginPayload, type AuthResponse } from '../../../utils/authData';
import { createToken } from '../../../utils/jwt';
import { UserProvider } from '../../../providers/UserProvider';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
    try {
        const body = (await request.json()) as LoginPayload;

        // Validation
        if (!body.email || !body.password) {
            return NextResponse.json(
                { success: false, message: 'Email and password are required' },
                { status: 400 }
            );
        }

        // Find user
        const user = await UserProvider.findByEmail(body.email);
        if (!user) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Check password
        const isPasswordValid = await comparePasswords(body.password, user.passwordHash);
        if (!isPasswordValid) {
            return NextResponse.json(
                { success: false, message: 'Invalid email or password' },
                { status: 401 }
            );
        }

        // Create token
        const userWithoutPassword = {
            id: user._id.toString(),
            email: user.email,
            username: user.username,
            createdAt: user.createdAt,
        };

        const token = createToken(userWithoutPassword);

        // Set token in httpOnly cookie
        const response = NextResponse.json(
            {
                success: true,
                message: 'Login successful',
                user: userWithoutPassword,
                token,
            },
            { status: 200 }
        );

        response.cookies.set({
            name: 'authToken',
            value: token,
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 * 24 * 7, // 7 days
        });

        return response;
    } catch (error) {
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        );
    }
}
