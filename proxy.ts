import { NextRequest, NextResponse } from "next/server";
import { verifyToken, getTokenFromRequest } from "@/app/utils/jwt";
import { nextjsRateLimit } from "@universal-rate-limit/nextjs";

const ALLOWED_ORIGINS = ["http://localhost:3000", process.env.NEXT_PUBLIC_BASE_URL];

const limiter = nextjsRateLimit({
  limit: 60, // Limit each key to 5 requests per window
  algorithm: { type: "sliding-window", windowMs: 60000 },
});

const publicRoutes = ["/api/auth/login", "/api/auth/register", "/login", "/register", "/server-error"];

export async function proxy(request: NextRequest) {
  const response = NextResponse.next();
  const pathname = request.nextUrl.pathname;

  // Skip middleware for public routes
  if (publicRoutes.includes(pathname)) {
    return response;
  }

  // CORS
  const headers = corsHeaders(request);
  Object.entries(headers).forEach(([key, value]) => {
    response.headers.set(key, value);
  });

  // Rate Limiting
  const result = await limiter(request);
  if (result.limited) {
    return NextResponse.redirect(new URL("/server-error", request.url));
  }

  // JWT auth
  const payload = verifyToken(getTokenFromRequest(request) ?? "");
  if (!payload) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  response.headers.set("jwt-payload", JSON.stringify(payload));

  return response;
}

function corsHeaders(request: NextRequest) {
  const origin = request.headers.get("origin");
  const isAllowedOrigin = !origin || ALLOWED_ORIGINS.includes(origin);

  return {
    "Access-Control-Allow-Origin": isAllowedOrigin ? origin || "*" : "null",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, X-CSRF-Token",
    "Access-Control-Allow-Credentials": "true",
    "Access-Control-Max-Age": "86400",
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
    "/((?!_next/static|_next/image|favicon.ico|public).*)",
  ],
};

