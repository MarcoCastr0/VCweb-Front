/**
 * @file UserService.ts
 * @description Service for handling user CRUD operations with the backend API
 */

import type { User, UpdateUserData } from './User';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class UserService {
  // Obtener usuario por ID
  static async getUserById(id: string): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user');
    }

    return response.json();
  }

  // Actualizar usuario
  static async updateUser(id: string, updates: UpdateUserData): Promise<User> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updates),
    });

    if (!response.ok) {
      throw new Error('Failed to update user');
    }

    return response.json();
  }

  // Eliminar usuario
  static async deleteUser(id: string): Promise<{ message: string }> {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to delete user');
    }

    return response.json();
  }

  // Obtener todos los usuarios (para admin)
  static async getAllUsers(): Promise<User[]> {
    const response = await fetch(`${API_URL}/users`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    return response.json();
  }
}