/**
 * Represents a user object stored in the system.
 * @interface
 */
export interface User {
  /** Unique identifier for the user */
  id: string;

  /** Full name of the user */
  name: string;

  /** Email address of the user */
  email: string;

  /** URL of the user's profile photo */
  photoURL?: string | null;

  /** Authentication provider used by the user */
  provider: 'google' | 'facebook' | 'manual';

  /** Timestamp indicating when the user was created */
  createdAt: string;

  /** Timestamp indicating the last update to the user */
  updatedAt: string;

  /** Optional age of the user */
  age?: number;
}

/**
 * Represents the response returned after an authentication request.
 * @interface
 */
export interface AuthResponse {
  /** Indicates whether the authentication was successful */
  success: boolean;

  /** Message describing the authentication result */
  message: string;

  /** User data returned after authentication */
  user: User;
}

/**
 * Represents data allowed for updating a user profile.
 * @interface
 */
export interface UpdateUserData {
  /** Updated full name */
  name?: string;

  /** Updated email address */
  email?: string;

  /** Updated age */
  age?: string;

  /** Updated profile photo URL */
  photoURL?: string | null;
}
