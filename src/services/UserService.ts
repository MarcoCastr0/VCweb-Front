import type { User, UpdateUserData } from "./User";

const API_URL = (import.meta as any).env.VITE_API_URL || "https://vcweb-back1.onrender.com";

export class UserService {
  /**
   * Retrieves a user by their ID.
   * @param {string} id - The user's unique identifier.
   * @returns {Promise<User>} The user data.
   * @throws {Error} If the request fails.
   */
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

  /**
   * Updates an existing user with new data.
   * @param {string} id - The user's unique identifier.
   * @param {UpdateUserData} updates - The fields to update.
   * @returns {Promise<User>} The updated user.
   * @throws {Error} If the update request fails.
   */
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

  /**
   * Deletes a user by their ID.
   * @param {string} id - The user's unique identifier.
   * @returns {Promise<{ message: string }>} A message confirming deletion.
   * @throws {Error} If the deletion request fails.
   */
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

  /**
   * Retrieves all users from the backend.
   * @returns {Promise<User[]>} A list of all users.
   * @throws {Error} If the request fails.
   */
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
