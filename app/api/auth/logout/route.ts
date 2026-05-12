import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    // Clear the auth token cookie
    let response: any = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'authToken',
      value: '',
      httpOnly: true,
      maxAge: 0, // This deletes the cookie
    });

    return response;
  } catch (error) {
    let response: any = NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
    return response;
  }
}