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

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export class AuthService {
  // Validar token de Firebase con el backend
  static async validateIdToken(idToken: string): Promise<AuthResponse> {
    const response = await fetch(`${API_URL}/auth/validate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ idToken }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Error de autenticación' }));
      throw new Error(errorData.error || 'Error de autenticación');
    }

    return response.json();
  }

  // Login con email y contraseña
  static async loginWithEmail(email: string, password: string): Promise<AuthResponse> {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const idToken = await userCredential.user.getIdToken();
      
      const result = await this.validateIdToken(idToken);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || 'Error en la autenticación');
      }
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || 'Error al iniciar sesión');
    }
  }

  // En AuthService.ts - CORREGIR registerWithEmail
static async registerWithEmail(userData: {
  email: string;
  password: string;
  name: string;
  lastName: string;
  age: string;
}): Promise<AuthResponse> {
  try {
    console.log('🔄 Registrando usuario manual...', userData);
    
    // 1. Crear usuario en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(
      auth, 
      userData.email, 
      userData.password
    );
    
    const firebaseUser = userCredential.user;
    console.log('✅ Usuario creado en Firebase Auth:', firebaseUser.uid);
    
    // 2. Crear usuario en nuestro backend con nombre completo
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
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userPayload),
    });

    if (!createResponse.ok) {
      const errorData = await createResponse.json().catch(() => ({ error: 'Error creando usuario' }));
      throw new Error(errorData.error || 'Error creando usuario en el backend');
    }

    const backendUser = await createResponse.json();
    console.log('✅ Usuario creado en backend:', backendUser);
    
    // 3. ACTUALIZAR LA EDAD POR SEPARADO (ya que el backend la acepta en updates)
    if (userData.age) {
      try {
        console.log('📤 Actualizando edad:', userData.age);
        const updateResponse = await fetch(`${API_URL}/users/${firebaseUser.uid}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ age: userData.age }),
        });

        if (updateResponse.ok) {
          const updatedUser = await updateResponse.json();
          console.log('✅ Edad actualizada:', updatedUser);
          // Usar el usuario actualizado con la edad
          backendUser.age = userData.age;
        } else {
          console.warn('⚠️ No se pudo guardar la edad, pero el usuario se creó correctamente');
        }
      } catch (updateError) {
        console.warn('⚠️ Error actualizando edad:', updateError);
        // No fallar el registro completo si la edad falla
      }
    }
    
    return {
      success: true,
      message: 'Registro exitoso',
      user: backendUser
    };
    
  } catch (error: any) {
    console.error('❌ Error en registro:', error);
    throw new Error(this.getAuthErrorMessage(error.code) || 'Error al registrar usuario');
  }
}

  // Login con proveedor social
  static async loginWithProvider(provider: 'google' | 'facebook' | 'github'): Promise<AuthResponse> {
    try {
      let authProvider;
      
      switch (provider) {
        case 'google':
          authProvider = googleProvider;
          break;
        case 'facebook':
          authProvider = facebookProvider;
          break;
        case 'github':
          authProvider = githubProvider;
          break;
        default:
          throw new Error('Proveedor no soportado');
      }

      const userCredential = await signInWithPopup(auth, authProvider);
      const idToken = await userCredential.user.getIdToken();
      
      const result = await this.validateIdToken(idToken);
      
      if (result.success) {
        return result;
      } else {
        throw new Error(result.message || `Error al iniciar sesión con ${provider}`);
      }
    } catch (error: any) {
      throw new Error(this.getAuthErrorMessage(error.code) || `Error al iniciar sesión con ${provider}`);
    }
  }

  // Obtener mensaje de error amigable
  private static getAuthErrorMessage(errorCode: string): string {
    const errorMessages: { [key: string]: string } = {
      'auth/invalid-email': 'El correo electrónico no es válido',
      'auth/user-disabled': 'Esta cuenta ha sido deshabilitada',
      'auth/user-not-found': 'No existe una cuenta con este correo',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'Ya existe una cuenta con este correo',
      'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres',
      'auth/network-request-failed': 'Error de conexión. Verifica tu internet',
      'auth/popup-closed-by-user': 'La ventana de autenticación fue cerrada',
      'auth/operation-not-allowed': 'Este método de autenticación no está habilitado',
      'auth/account-exists-with-different-credential': 'Ya existe una cuenta con este email usando otro proveedor',
      'auth/popup-blocked': 'El popup de autenticación fue bloqueado por el navegador'
    };

    return errorMessages[errorCode] || 'Error de autenticación';
  }

  // Guardar usuario en localStorage
  static saveUserToStorage(user: User): void {
    localStorage.setItem('currentUser', JSON.stringify(user));
    localStorage.setItem('isAuthenticated', 'true');
  }

  // Obtener usuario del localStorage
  static getCurrentUser(): User | null {
    const userStr = localStorage.getItem('currentUser');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Verificar si está autenticado
  static isAuthenticated(): boolean {
    return localStorage.getItem('isAuthenticated') === 'true';
  }

  // Cerrar sesión
  static async logout(): Promise<void> {
    try {
      await auth.signOut();
    } catch (error) {
      console.error('Error al cerrar sesión:', error);
    } finally {
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
    }
  }
}