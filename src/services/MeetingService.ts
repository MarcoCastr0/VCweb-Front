/**
 * @fileoverview MeetingService
 * @description Provides methods to create, validate, list, and close meetings.
 * The documentation is in English; however, all messages returned to the user remain in Spanish.
 */

const API_URL = (import.meta as any).env.VITE_API_URL;

/**
 * @typedef {Object} Meeting
 * @property {string} [id]
 * @property {string} meetingId
 * @property {string} hostId
 * @property {number} [participantCount]
 * @property {boolean} [isActive]
 * @property {string} [createdAt]
 * @property {string} [updatedAt]
 */

/**
 * @typedef {Object} ApiResponse
 * @property {boolean} [success]
 * @property {string} [message]
 * @property {string} [meetingId]
 * @property {Meeting} [meeting]
 * @property {Meeting[]} [meetings]
 * @property {number} [participantCount]
 * @property {any} [key]
 */

export interface Meeting {
  id?: string;
  meetingId: string;
  hostId: string;
  participantCount?: number;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  success?: boolean;
  message?: string;
  meetingId?: string;
  meeting?: T;
  meetings?: T[];
  participantCount?: number;
  [key: string]: any;
}

export class MeetingService {
  /**
   * Create a new meeting for a user.
   * @async
   * @param {string} hostId - ID of the meeting creator.
   * @returns {Promise<{success: boolean, meetingId: string, message?: string}>}
   * The message shown to the user is in Spanish.
   */
  static async createMeeting(hostId: string): Promise<{
    success: boolean;
    meetingId: string;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId }),
      });

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          meetingId: "",
          message: data.message || "Error al crear la reunión",
        };
      }

      return {
        success: true,
        meetingId: data.meetingId || "",
      };
    } catch (error: any) {
      return {
        success: false,
        meetingId: "",
        message: error.message || "Error de red al crear reunión",
      };
    }
  }

  /**
   * Validate if a meeting exists and is active.
   * @async
   * @param {string} meetingId - ID of the meeting to validate.
   * @returns {Promise<{success: boolean, meeting?: Meeting, message?: string}>}
   * Messages displayed to the user remain in Spanish.
   */
  static async validateMeeting(meetingId: string): Promise<{
    success: boolean;
    meeting?: Meeting;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/${meetingId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Reunión no encontrada o expirada",
        };
      }

      return {
        success: true,
        meeting: data.meeting as Meeting,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al validar reunión",
      };
    }
  }

  /**
   * Retrieve all meetings associated with a given user.
   * @async
   * @param {string} userId - User ID whose meetings should be fetched.
   * @returns {Promise<{success: boolean, meetings?: Meeting[], message?: string}>}
   * User-facing messages appear in Spanish.
   */
  static async getUserMeetings(userId: string): Promise<{
    success: boolean;
    meetings?: Meeting[];
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/user/${userId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al obtener reuniones",
        };
      }

      return {
        success: true,
        meetings: (data.meetings || []) as Meeting[],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al obtener reuniones",
      };
    }
  }

  /**
   * Close a meeting by its ID.
   * @async
   * @param {string} meetingId - ID of the meeting to close.
   * @returns {Promise<{success: boolean, message?: string}>}
   * The message returned to the user is always in Spanish.
   */
  static async closeMeeting(meetingId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/${meetingId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al cerrar reunión",
        };
      }

      return {
        success: true,
        message: data.message || "Reunión cerrada correctamente",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al cerrar reunión",
      };
    }
  }
}
