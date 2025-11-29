/**
 * @file AuthService.ts
 * @description Handles authentication logic including email/password login,
 * social login, token validation, registration, and local storage session handling.
 */

import { 
  auth,
  googleProvider,
  facebookProvider,
  githubProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  fetchSignInMethodsForEmail,
  linkWithCredential
} from './FirebaseClient';

import type { User, AuthResponse } from './User';

const API_URL = (import.meta as any).env.VITE_API_URL || 'https://vcweb-back1.onrender.com';

export class AuthService {

  /* -------------------------------------------------------------------------- */
  /*                       VALIDAR TOKEN CONTRA BACKEND                         */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                            LOGIN CON CORREO                                */
  /* -------------------------------------------------------------------------- */
  static async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();

      const result = await this.validateIdToken(idToken);
      if (!result.success) throw new Error(result.message || 'Error en la autenticación');

      return result;

    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || 'Error al iniciar sesión');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                               REGISTRO                                     */
  /* -------------------------------------------------------------------------- */
  static async registerWithEmail(userData: {
    email: string;
    password: string;
    name: string;
    lastName: string;
    age: string;
  }): Promise<AuthResponse> {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, userData.email, userData.password);
      const firebaseUser = userCredential.user;

      const fullName = `${userData.name} ${userData.lastName}`.trim();

      const userPayload = {
        id: firebaseUser.uid,
        name: fullName,
        email: userData.email,
        provider: 'manual' as const,
      };

      const createResponse = await fetch(`${API_URL}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userPayload),
      });

      if (!createResponse.ok) {
        const errorData = (await createResponse.json().catch(() => ({ error: 'Error creando usuario' }))) as { error: string };
        throw new Error(errorData.error || 'Error creando usuario en el backend');
      }

      const backendUser = (await createResponse.json()) as User;

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
        } catch {}
      }

      return {
        success: true,
        message: 'Registro exitoso',
        user: backendUser,
      };

    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || 'Error al registrar usuario');
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                   LOGIN CON GOOGLE / FACEBOOK / GITHUB                     */
  /* -------------------------------------------------------------------------- */
  static async loginWithProvider(provider: 'google' | 'facebook' | 'github'): Promise<AuthResponse> {
    try {
      const providerMap = {
        google: googleProvider,
        facebook: facebookProvider,
        github: githubProvider,
      };

      const authProvider = providerMap[provider];

      if (!authProvider) {
        throw new Error('Proveedor no soportado');
      }

      // Intento normal
      const userCredential = await signInWithPopup(auth, authProvider);
      const idToken = await userCredential.user.getIdToken();
      return await this.validateIdToken(idToken);

    } catch (error: any) {

      /* ----------------------------- ERROR CLAVE ----------------------------- */
      if (error.code === "auth/account-exists-with-different-credential") {

        const email = error.customData.email;
        const pendingCred = error.credential;

        const existingProviders = await fetchSignInMethodsForEmail(auth, email);

        let existingUserCredential;

        if (existingProviders.includes("google.com")) {
          existingUserCredential = await signInWithPopup(auth, googleProvider);
        }

        if (existingProviders.includes("github.com")) {
          existingUserCredential = await signInWithPopup(auth, githubProvider);
        }

        if (existingProviders.includes("facebook.com")) {
          existingUserCredential = await signInWithPopup(auth, facebookProvider);
        }

        // Vincular proveedor adicional
        if (existingUserCredential) {
          await linkWithCredential(existingUserCredential.user, pendingCred);

          const idToken = await existingUserCredential.user.getIdToken();
          return await this.validateIdToken(idToken);
        }
      }

      /* -------------------------------- OTROS ERRORES ------------------------------ */
      throw new Error(this.getAuthErrorMessage(error.code) || `Error al iniciar sesión con ${provider}`);
    }
  }

  /* -------------------------------------------------------------------------- */
  /*                            ERRORES AMIGABLES                                */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                                STORAGE                                      */
  /* -------------------------------------------------------------------------- */
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

  /* -------------------------------------------------------------------------- */
  /*                                  LOGOUT                                     */
  /* -------------------------------------------------------------------------- */
  static async logout(): Promise<void> {
    try {
      await auth.signOut();
    } finally {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }
}
