/**
 * @file AuthService.ts
 * @description Service for handling authentication with the backend API
 */

import { 
  auth, 
  googleProvider, 
  facebookProvider, 
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword 
} from './FirebaseClient';
import type { User, AuthResponse } from './User';

// 🔧 FIX: import.meta.env tipado correctamente
const API_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:3000';

export class AuthService {

  // ------------------------------------
  // VALIDAR TOKEN
  // ------------------------------------
  static async validateIdToken(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = (await response.json().catch(() => ({ error: 'Error de autenticación' }))) as { error: string };
      throw new Error(errorData.error || 'Error de autenticación');
    }

    return (await response.json()) as AuthResponse;
  }

  // ------------------------------------
  // LOGIN EMAIL / PASSWORD
  // ------------------------------------
  static async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const result = await this.validateIdToken(idToken);

      if (!result.success) {
        throw new Error(result.message || 'Error en la autenticación');
      }

      return result;

    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || 'Error al iniciar sesión');
    }
  }

  // ------------------------------------
  // REGISTRO MANUAL (CORREGIDO)
  // ------------------------------------
  static async registerWithEmail(userData: {
    email: string;
    password: string;
    name: string;
    lastName: string;
    age: string;
  }): Promise<AuthResponse> {
    try {
      console.log('🔄 Registrando usuario manual...', userData);

      // 1. Crear usuario en Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      console.log('✅ Usuario creado en Firebase:', firebaseUser.uid);

      // 2. Payload para backend
      const fullName = `${userData.name} ${userData.lastName}`.trim();
      const userPayload = {
        id: firebaseUser.uid,
        name: fullName,
        email: userData.email,
        provider: 'manual' as const,
      };

      console.log('📤 Enviando datos al backend:', userPayload);

      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (!createResponse.ok) {
        const errorData = (await createResponse.json().catch(() => ({ error: 'Error creando usuario' }))) as { error: string };
        throw new Error(errorData.error || 'Error creando usuario en el backend');
      }

      // 🔧 FIX: backendUser tipado correctamente
      const backendUser = (await createResponse.json()) as User;

      console.log('✅ Usuario creado en backend:', backendUser);

      // 3. Actualizar edad
      if (userData.age) {
        try {
          const updateResponse = await fetch(`${API_URL}/users/${firebaseUser.uid}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ age: userData.age }),
          });

          if (updateResponse.ok) {
            const updatedUser = (await updateResponse.json()) as User;
            backendUser.age = updatedUser.age;
          }
        } catch (err) {
          console.warn('⚠️ No se pudo actualizar edad', err);
        }
      }

      return {
        success: true,
        message: 'Registro exitoso',
        user: backendUser,
      };

    } catch (error: any) {
      console.error('❌ Error en registro:', error);
      throw new Error(this.getAuthErrorMessage(error.code) || 'Error al registrar usuario');
    }
  }

  // ------------------------------------
  // LOGIN SOCIAL
  // ------------------------------------
  static async loginWithProvider(provider: 'google' | 'facebook' | 'github'): Promise<AuthResponse> {
    try {
      const providerMap = {
        google: googleProvider,
        facebook: facebookProvider,
        github: githubProvider,
      };

      const authProvider = providerMap[provider];
      if (!authProvider) throw new Error('Proveedor no soportado');

      const userCredential = await signInWithPopup(auth, authProvider);
      const idToken = await userCredential.user.getIdToken();
      const result = await this.validateIdToken(idToken);

      if (!result.success) {
        throw new Error(result.message || `Error con ${provider}`);
      }

      return result;

    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || `Error al iniciar sesión con ${provider}`);
    }
  }

  // ------------------------------------
  // ERRORES AMIGABLES
  // ------------------------------------
  private static getAuthErrorMessage(code: string): string {
    const messages: Record<string, string> = {
      'auth/invalid-email': 'El correo es inválido',
      'auth/user-disabled': 'Esta cuenta fue deshabilitada',
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Este correo ya está registrado',
      'auth/weak-password': 'Contraseña muy débil',
    };

    return messages[code] || 'Error de autenticación';
  }

  // ------------------------------------
  // LOCAL STORAGE
  // ------------------------------------
  static saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  static getCurrentUser(): User | null {
    const data = localStorage.getItem('currentUser');
    return data ? (JSON.parse(data) as User) : null;
  }

  static isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  static async logout(): Promise<void> {
    try {
      await auth.signOut();
    } finally {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }
}
