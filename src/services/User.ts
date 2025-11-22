/**
 * @file types/User.ts
 * @description User type definitions
 */

export interface User {
  id: string;
  name: string;
  email: string;
  photoURL?: string | null;
  provider: 'google' | 'facebook' | 'github' | 'manual';
  createdAt: string;
  updatedAt: string;
  age?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface UpdateUserData {
  name?: string;
  email?: string;
  age?: string;
  photoURL?: string | null;
}