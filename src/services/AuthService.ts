/**
 * @file AuthService.ts
 * @description Handles authentication logic including email/password login, social login,
 * token validation, registration, and local storage session handling.
 */

import {
  auth,
  googleProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
} from "./FirebaseClient";
import type { User, AuthResponse } from "./User";

const API_URL = (import.meta as any).env.VITE_API_URL || "https://vcweb-back1.onrender.com";

export class AuthService {
  /**
   * Validates an ID token with the backend API.
   * @param {string} idToken - Firebase ID token.
   * @returns {Promise<AuthResponse>} Response with validation result.
   * @throws {Error} If the backend returns an authentication error.
   */
  static async validateIdToken(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = (await response
        .json()
        .catch(() => ({ error: "Error de autenticación" }))) as { error: string };
      throw new Error(errorData.error || "Error de autenticación");
    }

    return (await response.json()) as AuthResponse;
  }

  /**
   * Logs in a user using email and password via Firebase and validates the token with the backend.
   * @param {string} email - User email.
   * @param {string} password - User password.
   * @returns {Promise<AuthResponse>} Auth response from backend.
   * @throws {Error} With friendly authentication error message.
   */
  static async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const result = await this.validateIdToken(idToken);
      if (!result.success) {
        throw new Error(result.message || "Error en la autenticación");
      }

      this.saveUserToStorage(result.user as User);
      return result;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || "Error al iniciar sesión");
    }
  }

  /**
   * Registers a user via Firebase and then creates their profile in the backend database.
   * @param {Object} userData - User registration data.
   * @param {string} userData.email - Email address.
   * @param {string} userData.password - Password.
   * @param {string} userData.name - First name.
   * @param {string} userData.lastName - Last name.
   * @param {string} userData.age - Age.
   * @returns {Promise<AuthResponse>} Response with created user data.
   * @throws {Error} If registration or backend user creation fails.
   */
  static async registerWithEmail(userData: {
    email: string;
    password: string;
    name: string;
    lastName: string;
    age: string;
  }): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        userData.email,
        userData.password
      );
      const firebaseUser = userCredential.user;

      const fullName = `${userData.name} ${userData.lastName}`.trim();
      const userPayload = {
        id: firebaseUser.uid,
        name: fullName,
        email: userData.email,
        provider: "manual" as const,
      };

      const createResponse = await fetch(`${API_URL}/users`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userPayload),
      });

      if (!createResponse.ok) {
        const errorData = (await createResponse
          .json()
          .catch(() => ({ error: "Error creando usuario" }))) as { error: string };
        throw new Error(errorData.error || "Error creando usuario en el backend");
      }

      const backendUser = (await createResponse.json()) as User;

      if (userData.age) {
        try {
          const updateResponse = await fetch(`${API_URL}/users/${firebaseUser.uid}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ age: userData.age }),
          });

          if (updateResponse.ok) {
            const updatedUser = (await updateResponse.json()) as User;
            backendUser.age = updatedUser.age;
          }
        } catch {
          // ignore age update error
        }
      }

      const result: AuthResponse = {
        success: true,
        message: "Registro exitoso",
        user: backendUser,
      };

      this.saveUserToStorage(backendUser);
      return result;
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || "Error al registrar usuario");
    }
  }

  /**
   * Authenticates a user using a social provider (Google, GitHub).
   * @param {'google' | 'github'} provider - Social provider name.
   * @returns {Promise<AuthResponse>} Backend authentication response.
   * @throws {Error} If login or backend validation fails.
   */
  static async loginWithProvider(
    provider: "google" | "github"
  ): Promise<AuthResponse> {
    try {
      const providerMap = {
        google: googleProvider,
        github: githubProvider,
      };

      const authProvider = providerMap[provider];
      if (!authProvider) throw new Error("Proveedor no soportado");

      const userCredential = await signInWithPopup(auth, authProvider);
      const idToken = await userCredential.user.getIdToken();
      const result = await this.validateIdToken(idToken);

      if (!result.success) {
        throw new Error(result.message || `Error con ${provider}`);
      }

      this.saveUserToStorage(result.user as User);
      return result;
    } catch (error: any) {
      // Manejo especial para cuenta existente con otro proveedor
      if (error?.code === "auth/account-exists-with-different-credential") {
        throw new Error(
          "Ya existe una cuenta con este correo usando otro método de acceso (por ejemplo Google). Inicia sesión con ese proveedor."
        );
      }

      throw new Error(
        this.getAuthErrorMessage(error.code) || `Error al iniciar sesión con ${provider}`
      );
    }
  }

  /**
   * Returns a friendly error message for Firebase authentication error codes.
   * @param {string} code - Firebase error code.
   * @returns {string} Friendly error message.
   * @private
   */
  private static getAuthErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      "auth/invalid-email": "El correo es inválido",
      "auth/user-disabled": "Esta cuenta fue deshabilitada",
      "auth/user-not-found": "Usuario no encontrado",
      "auth/wrong-password": "Contraseña incorrecta",
      "auth/email-already-in-use": "Este correo ya está registrado",
      "auth/weak-password": "Contraseña muy débil",
      "auth/popup-closed-by-user": "Ventana de autenticación cerrada",
      "auth/cancelled-popup-request": "Solicitud cancelada",
      "auth/account-exists-with-different-credential":
        "Ya existe una cuenta con este correo usando otro método de acceso. Inicia sesión con el proveedor con el que te registraste inicialmente.",
    };

    return messages[code] || "Error de autenticación";
  }

  /**
   * Saves a user to local storage.
   * @param {User} user - User to save.
   * @returns {void}
   */
  static saveUserToStorage(user: User): void {
    localStorage.setItem("currentUser", JSON.stringify(user));
    localStorage.setItem("isAuthenticated", "true");
  }

  /**
   * Retrieves the current user from local storage.
   * @returns {User | null} Parsed user object or null.
   */
  static getCurrentUser(): User | null {
    const data = localStorage.getItem("currentUser");
    return data ? (JSON.parse(data) as User) : null;
  }

  /**
   * Checks whether a user is authenticated.
   * @returns {boolean} True if authenticated.
   */
  static isAuthenticated(): boolean {
    return localStorage.getItem("isAuthenticated") === "true";
  }

  /**
   * Logs out the user from Firebase and removes local storage session data.
   * @returns {Promise<void>} Promise resolving when logout is complete.
   */
  static async logout(): Promise<void> {
    try {
      await auth.signOut();
    } finally {
      localStorage.removeItem("currentUser");
      localStorage.removeItem("isAuthenticated");
    }
  }
}
