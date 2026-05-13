import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();

    cookieStore.getAll().forEach((cookie) => {
      cookieStore.delete(cookie.name)
    })

    // Clear the auth token cookie
    let response: any = NextResponse.json(
      {
        success: true,
        message: 'Logout successful',
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