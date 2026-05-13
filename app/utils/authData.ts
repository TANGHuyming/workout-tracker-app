const bcrypt = require('bcrypt');

export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

export interface LoginPayload {
    email: string;
    password: string;
}

export interface RegisterPayload {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
}

export interface AuthResponse {
    success: boolean;
    message: string;
    user?: Omit<User, 'passwordHash'>;
    token?: string;
}

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

// Compare plain password with hashed password using bcrypt
export const comparePasswords = async (plain: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
};
