import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './app/utils/jwt';
import { nextjsRateLimit } from '@universal-rate-limit/nextjs';

const ALLOWED_ORIGINS = [
    'http://localhost:3000',
    'http://localhost:3001',
    process.env.NEXT_PUBLIC_APP_URL,
];

const limiter = nextjsRateLimit({
    limit: 20,            // Limit each key to 5 requests per window
    algorithm: { type: 'sliding-window', windowMs: 60000 },
})

const publicRoutes = ['/api/auth/login', '/api/auth/register'];

export async function proxy(request: NextRequest) {
    const response = NextResponse.next();
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
    response.headers.set('jwt-payload', JSON.stringify(payload));

    // CORS
    const headers = corsHeaders(request);
    Object.entries(headers).forEach(([key, value]) => {
        response.headers.set(key, value);
    });

    // Rate Limiting
    const result = await limiter(request);
    if (result.limited) {
        return NextResponse.json({ success: false, message: 'Rate limit exceeded' }, { status: 429 });
    }

    return response;
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

function corsHeaders(request: NextRequest) {
    const origin = request.headers.get('origin');
    const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin);

    return {
        'Access-Control-Allow-Origin': isAllowedOrigin ? origin || '*' : 'null',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, PATCH, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-CSRF-Token',
        'Access-Control-Allow-Credentials': 'true',
        'Access-Control-Max-Age': '86400',
    };
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