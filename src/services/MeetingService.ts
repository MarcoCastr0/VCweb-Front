/**
 * @fileoverview MeetingService
 * @description Provides methods to create, validate, list, and close meetings.
 * The documentation is in English; however, all messages returned to the user remain in Spanish.
 */

const API_URL = (import.meta as any).env.VITE_API_URL;

export interface Meeting {
  id?: string;
  meetingId: string;
  hostId: string;
  participantCount?: number;
  maxParticipants?: number;
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
  maxParticipants?: number;
  canJoin?: boolean;
  [key: string]: any;
}

export class MeetingService {
  /**
   * Create a new meeting for a user.
   * @async
   * @param {string} hostId - ID of the meeting creator.
   * @param {number} [maxParticipants=10] - Maximum number of participants (2-10).
   * @returns {Promise<{success: boolean, meetingId: string, maxParticipants?: number, message?: string}>}
   * The message shown to the user is in Spanish.
   */
  static async createMeeting(
    hostId: string,
    maxParticipants: number = 10
  ): Promise<{
    success: boolean;
    meetingId: string;
    maxParticipants?: number;
    message?: string;
  }> {
    try {
      // Validar límites en el frontend
      if (maxParticipants < 2 || maxParticipants > 10) {
        return {
          success: false,
          meetingId: "",
          message: "El número de participantes debe estar entre 2 y 10",
        };
      }

      const response = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ hostId, maxParticipants }),
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
        maxParticipants: data.maxParticipants,
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
   * @returns {Promise<{success: boolean, meeting?: Meeting, canJoin?: boolean, message?: string}>}
   * Messages displayed to the user remain in Spanish.
   */
  static async validateMeeting(meetingId: string): Promise<{
    success: boolean;
    meeting?: Meeting;
    canJoin?: boolean;
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
        canJoin: data.canJoin,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al validar reunión",
      };
    }
  }

  /**
   * Check if a user can join a meeting (not full).
   * @async
   * @param {string} meetingId - ID of the meeting to check.
   * @returns {Promise<{success: boolean, canJoin: boolean, meeting?: Meeting, message?: string}>}
   */
  static async canJoinMeeting(meetingId: string): Promise<{
    success: boolean;
    canJoin: boolean;
    meeting?: Meeting;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_URL}/api/meetings/${meetingId}/can-join`,
        {
          method: "GET",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok) {
        return {
          success: false,
          canJoin: false,
          message: data.message || "No puedes unirte a esta reunión",
        };
      }

      return {
        success: true,
        canJoin: data.canJoin || false,
        meeting: data.meeting as Meeting,
        message: data.message,
      };
    } catch (error: any) {
      return {
        success: false,
        canJoin: false,
        message: error.message || "Error al verificar reunión",
      };
    }
  }

  /**
   * Join a meeting (increment participant count).
   * @async
   * @param {string} meetingId - ID of the meeting to join.
   * @param {string} userId - ID of the user joining.
   * @returns {Promise<{success: boolean, meeting?: Meeting, message?: string}>}
   */
  static async joinMeeting(
    meetingId: string,
    userId: string
  ): Promise<{
    success: boolean;
    meeting?: Meeting;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_URL}/api/meetings/${meetingId}/join`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId }),
        }
      );

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "No se pudo unir a la reunión",
        };
      }

      return {
        success: true,
        meeting: data.meeting as Meeting,
        message: data.message || "Te has unido a la reunión",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al unirse a la reunión",
      };
    }
  }

  /**
   * Leave a meeting (decrement participant count).
   * @async
   * @param {string} meetingId - ID of the meeting to leave.
   * @returns {Promise<{success: boolean, message?: string}>}
   */
  static async leaveMeeting(meetingId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(
        `${API_URL}/api/meetings/${meetingId}/leave`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
        }
      );

      const data = (await response.json()) as ApiResponse<Meeting>;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al salir de la reunión",
        };
      }

      return {
        success: true,
        message: data.message || "Has salido de la reunión",
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al salir de la reunión",
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

  /**
   * Get meeting statistics (for display purposes).
   * @param {Meeting} meeting - Meeting object.
   * @returns {string} Formatted participant info in Spanish.
   */
  static getMeetingStats(meeting: Meeting): string {
    const current = meeting.participantCount || 0;
    const max = meeting.maxParticipants || 10;
    return `${current}/${max} participantes`;
  }

  /**
   * Check if a meeting is full.
   * @param {Meeting} meeting - Meeting object.
   * @returns {boolean} True if meeting is at capacity.
   */
  static isMeetingFull(meeting: Meeting): boolean {
    const current = meeting.participantCount || 0;
    const max = meeting.maxParticipants || 10;
    return current >= max;
  }
}