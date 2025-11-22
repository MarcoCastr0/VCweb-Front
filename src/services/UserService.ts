/**
 * @file UserService.ts
 * @description Service for handling user CRUD operations with the backend API
 */

import type { User, UpdateUserData } from "./User";

// 🔧 FIX: import.meta.env tipado correctamente
const API_URL = (import.meta as any).env.VITE_API_URL || "http://localhost:3000";

export class UserService {

  // ------------------------------------
  // GET USER BY ID
  // ------------------------------------
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user");
    }

    return (await response.json()) as User;
  }

  // ------------------------------------
  // UPDATE USER
  // ------------------------------------
  static async updateUser(id: string, updates: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error("Failed to update user");
    }

    return (await response.json()) as User;
  }

  // ------------------------------------
  // DELETE USER
  // ------------------------------------
  static async deleteUser(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to delete user");
    }

    return (await response.json()) as { message: string };
  }

  // ------------------------------------
  // GET ALL USERS
  // ------------------------------------
  static async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch users");
    }

    return (await response.json()) as User[];
  }
}
