import { connectDB } from '../lib/mongodb';
import UserModel, { IUser } from '../models/User';

export class UserProvider {
  /**
   * Create a new user
   */
  static async create(userData: {
    email: string;
    username: string;
    passwordHash: string;
  }): Promise<IUser> {
    try {
      await connectDB();
      const user = await UserModel.create(userData);
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        // Duplicate key error
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  /**
   * Find user by ID
   */
  static async findById(userId: string): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await UserModel.findById(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by email
   */
  static async findByEmail(email: string): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await UserModel.findOne({ email: email.toLowerCase() }).select('+passwordHash');
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Find user by username
   */
  static async findByUsername(username: string): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await UserModel.findOne({ username });
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Get all users
   */
  static async findAll(): Promise<IUser[]> {
    try {
      await connectDB();
      const users = await UserModel.find();
      return users;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Update user
   */
  static async update(
    userId: string,
    updateData: Partial<{
      email?: string;
      username?: string;
      passwordHash?: string;
    }>
  ): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await UserModel.findByIdAndUpdate(userId, updateData, {
        new: true,
        runValidators: true,
      });
      return user;
    } catch (error: any) {
      if (error.code === 11000) {
        const field = Object.keys(error.keyPattern)[0];
        throw new Error(`${field} already exists`);
      }
      throw error;
    }
  }

  /**
   * Delete user
   */
  static async delete(userId: string): Promise<IUser | null> {
    try {
      await connectDB();
      const user = await UserModel.findByIdAndDelete(userId);
      return user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if email exists
   */
  static async emailExists(email: string): Promise<boolean> {
    try {
      await connectDB();
      const user = await UserModel.findOne({ email: email.toLowerCase() });
      return !!user;
    } catch (error) {
      throw error;
    }
  }

  /**
   * Check if username exists
   */
  static async usernameExists(username: string): Promise<boolean> {
    try {
      await connectDB();
      const user = await UserModel.findOne({ username });
      return !!user;
    } catch (error) {
      throw error;
    }
  }
}
