import { NextRequest, NextResponse } from 'next/server';
const csrf = require('csrf');

const csrfProtection = new csrf();

// Generate CSRF token
export function generateCsrfToken(secret: string): string {
  return csrfProtection.create(secret);
}

// Validate CSRF token
export function validateCsrfToken(token: string, secret: string): boolean {
  try {
    return csrfProtection.verify(secret, token);
  } catch {
    return false;
  }
}

// Get CSRF secret from cookie or generate new one
export function getCsrfSecret(request: NextRequest): string {
  let secret = request.cookies.get('csrf-secret')?.value;
  if (!secret) {
    secret = csrfProtection.secretSync();
  }
  return secret as string;
}

// Verify CSRF token from request
export async function verifyCsrfFromRequest(request: NextRequest): Promise<boolean> {
  // GET requests don't need CSRF validation
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return true;
  }

  const secret = getCsrfSecret(request);
  const token = request.headers.get('x-csrf-token') || request.headers.get('X-CSRF-Token');

  if (!token) {
    return false;
  }

  return validateCsrfToken(token, secret);
}

// Add CSRF token to response
export function addCsrfTokenToResponse(request: NextRequest, response: NextResponse): NextResponse {
  const secret = getCsrfSecret(request);
  const token = generateCsrfToken(secret);

  response.cookies.set({
    name: 'csrf-secret',
    value: secret,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 7, // 7 days
  });

  response.headers.set('X-CSRF-Token', token);

  return response;
}

export function csrfMiddleware(request: NextRequest): NextResponse | null {
  // Skip CSRF check for GET, HEAD, OPTIONS
  if (request.method === 'GET' || request.method === 'HEAD' || request.method === 'OPTIONS') {
    return null;
  }

  // Skip CSRF check for public endpoints like register and login
  const pathname = new URL(request.url).pathname;
  const publicEndpoints = ['/api/auth/register', '/api/auth/login'];
  if (publicEndpoints.includes(pathname)) {
    return null;
  }

  // Verify CSRF token for protected endpoints
  const isValid = verifyCsrfFromRequest(request);
  if (!isValid) {
    return NextResponse.json(
      { success: false, message: 'CSRF token validation failed' },
      { status: 403 }
    );
  }

  return null;
}
