import { NextRequest, NextResponse } from 'next/server';
import { hashPassword, type RegisterPayload, type AuthResponse } from '../../../utils/authData';
import { createToken } from '../../../utils/jwt';
import { UserProvider } from '../../../providers/UserProvider';

export async function POST(request: NextRequest): Promise<NextResponse<AuthResponse>> {
  try {
    const body = (await request.json()) as RegisterPayload;

    // Validation
    if (!body.email || !body.username || !body.password || !body.confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'All fields are required' },
        { status: 400 }
      );
    }

    if (body.password !== body.confirmPassword) {
      return NextResponse.json(
        { success: false, message: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (body.password.length < 6) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingEmail = await UserProvider.findByEmail(body.email);
    if (existingEmail) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    const existingUsername = await UserProvider.findByUsername(body.username);
    if (existingUsername) {
      return NextResponse.json(
        { success: false, message: 'Username already taken' },
        { status: 400 }
      );
    }

    // Create new user with hashed password
    const hashedPassword = await hashPassword(body.password);
    const newUser = await UserProvider.create({
      email: body.email,
      username: body.username,
      passwordHash: hashedPassword,
    });

    // Create token
    const userWithoutPassword = {
      id: newUser._id.toString(),
      email: newUser.email,
      username: newUser.username,
      createdAt: newUser.createdAt,
    };

    const token = createToken(userWithoutPassword);

    // Set token in httpOnly cookie
    const response = NextResponse.json(
      {
        success: true,
        message: 'Registration successful',
        user: userWithoutPassword,
        token,
      },
      { status: 201 }
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
