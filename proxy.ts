import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './app/utils/jwt';
import { handleCors } from './app/lib/cors';
import { nextjsRateLimit } from '@universal-rate-limit/nextjs';
import { csrfMiddleware } from './app/lib/csrf';

const limiter = nextjsRateLimit({
    limit: 20,            // Limit each key to 5 requests per window
    algorithm: { type: 'sliding-window', windowMs: 60000 },
})

const publicRoutes = ['/api/auth/login', '/api/auth/register'];

export async function proxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Skip middleware for public routes
    if (publicRoutes.includes(pathname)) {
        return NextResponse.next();
    }

    // Skip middleware for non-API routes
    if (!pathname.startsWith('/api/')) {
        return NextResponse.next();
    }
    

    // JWT auth
    const payload = requireAuth(request);
    request.headers.set('jwt-payload', JSON.stringify(payload));

    // CORS
    handleCors(request);

    // Rate Limiting
    const result = await limiter(request);
    if(result.limited) {
        return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });
    }

    // CSRF
    csrfMiddleware(request);

    return NextResponse.next({
        request: {
            headers: request.headers
        }
    });
}

function requireAuth(request: NextRequest) {
    const token = getTokenFromRequest(request) || request.cookies.get('authToken')?.value;

    // check if user is logged in
    if (!token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    // verify token
    const payload = verifyToken(token);
    if (!payload || !payload.userId) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    return payload;
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