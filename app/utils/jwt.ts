const jwt = require('jsonwebtoken');
import type { User } from './authData';

const SECRET_KEY = process.env.JWT_SECRET || 'your-super-secret-key-change-in-production';

export interface TokenPayload {
    userId: string;
    email: string;
    username: string;
}

// Create JWT token using jsonwebtoken library
export const createToken = (user: Omit<User, 'passwordHash'>): string => {
    const payload: TokenPayload = {
        userId: user.id,
        email: user.email,
        username: user.username,
    };

    return jwt.sign(payload, SECRET_KEY, {
        algorithm: 'HS256',
        expiresIn: '7d',
    });
};

// Verify JWT token using jsonwebtoken library
export const verifyToken = (token: string): TokenPayload | null => {
    try {
        const payload = jwt.verify(token, SECRET_KEY) as TokenPayload;
        return payload;
    } catch (error) {
        return null;
    }
};

// Extract token from request header or cookie
export const getTokenFromRequest = (request: Request): string | null => {
    // Try to get from Authorization header first
    const authHeader = request.headers.get('Authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Try to get from cookies
    const cookieHeader = request.headers.get('Cookie');
    if (cookieHeader) {
        const cookies = cookieHeader.split(';').map((c) => c.trim());
        const authCookie = cookies.find((c) => c.startsWith('authToken='));
        if (authCookie) {
            return authCookie.substring('authToken='.length);
        }
    }

    return null;
};
