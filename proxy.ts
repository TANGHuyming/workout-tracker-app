import { NextRequest, NextResponse } from 'next/server';
import { verifyToken, getTokenFromRequest } from './app/utils/jwt';
import { handleCors } from './app/lib/cors';
import { nextjsRateLimit } from '@universal-rate-limit/nextjs';
import { csrfMiddleware } from './app/lib/csrf';

const limiter = nextjsRateLimit({
    limit: 20,            // Limit each key to 5 requests per window
    algorithm: { type: 'sliding-window', windowMs: 60000 },
})

export async function proxy(request: NextRequest) {
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

export const config = { matcher: '/api/workouts/:path*' };

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