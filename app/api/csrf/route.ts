import { NextResponse } from 'next/server';
import csrf from 'csrf';
import {cookies} from 'next/headers';

const csrfProtection = new csrf();
const secret = process.env.CSRF_SECRET as string;

export async function GET() {
    const token = csrfProtection.create(secret);
    const cookieStore = await cookies();

    cookieStore.set(
        'csrfToken',
        token,
        {
            httpOnly: true,
            maxAge: 24 * 60 * 60,
            sameSite: 'lax',
            secure: process.env.NODE_ENV === 'production',
        }
    )

    // Set CSRF token as an HTTP-only cookie
    const response = NextResponse.json(
        { 
            success: true, 
            csrfToken: token 
        }, 
        { status: 200 }
    );

    return response;
}