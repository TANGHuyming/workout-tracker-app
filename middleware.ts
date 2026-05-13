import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from './app/utils/jwt';

// Routes that don't require authentication
const publicRoutes = ['/api/auth/login', '/api/auth/register'];

export async function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Skip middleware for non-API routes
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }

    try {
        // Get auth token from cookie
        const token = request.cookies.get('authToken')?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: No auth token' },
                { status: 401 }
            );
        }

        // Verify token and get payload
        const payload = verifyToken(token);

        if (!payload) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Invalid token' },
                { status: 401 }
            );
        }

        // Create a new request with the jwt-payload header
        const requestHeaders = new Headers(request.headers);
        requestHeaders.set('jwt-payload', JSON.stringify(payload));

        // Continue with the modified request
        return NextResponse.next({
            request: {
                headers: requestHeaders,
            },
        });
    } catch (error) {
        console.error('Middleware error:', error);
        return NextResponse.json(
            { success: false, message: 'Unauthorized' },
            { status: 401 }
        );
    }
}

// Configure which routes use this middleware
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         * - public folder
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
};
