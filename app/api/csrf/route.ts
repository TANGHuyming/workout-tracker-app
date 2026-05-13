import { NextResponse } from 'next/server';
import csrf from 'csrf';

const csrfProtection = new csrf();
const secret = process.env.CSRF_SECRET as string;

export async function GET() {
    const token = csrfProtection.create(secret);

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