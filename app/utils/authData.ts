import bcrypt from 'bcrypt';

export interface User {
    id: string;
    email: string;
    username: string;
    passwordHash: string;
    createdAt: Date;
}

// Mock users database with bcrypt hashed passwords
export const mockUsers: User[] = [
    {
        id: '1',
        email: 'john@example.com',
        username: 'john_doe',
        passwordHash: bcrypt.hashSync('password123', 10), // bcrypt hash of 'password123'
        createdAt: new Date('2026-01-15'),
    },
    {
        id: '2',
        email: 'jane@example.com',
        username: 'jane_smith',
        passwordHash: bcrypt.hashSync('password456', 10), // bcrypt hash of 'password456'
        createdAt: new Date('2026-02-20'),
    },
];

// In-memory store for testing (in production, use a real database)
let users = [...mockUsers];

export const userStore = {
    findByEmail: (email: string) => users.find((u) => u.email === email),
    findByUsername: (username: string) => users.find((u) => u.username === username),
    findById: (id: string) => users.find((u) => u.id === id),
    create: (user: Omit<User, 'id' | 'createdAt'>) => {
        const newUser: User = {
            ...user,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        users.push(newUser);
        return newUser;
    },
    getAll: () => users,
};

// Hash password using bcrypt
export const hashPassword = async (password: string): Promise<string> => {
    const saltRounds = 10;
    return bcrypt.hash(password, saltRounds);
};

// Compare plain password with hashed password using bcrypt
export const comparePasswords = async (plain: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(plain, hash);
};

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
