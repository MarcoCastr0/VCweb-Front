/**
 * Service for managing meeting operations via Backend 1 (Firestore).
 *
 * Handles meeting creation, validation, listing and closing.
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

interface ApiResponse {
  success: boolean;
  message?: string;
  meetingId?: string;
  meeting?: Meeting;
  meetings?: Meeting[];
  maxParticipants?: number;
}

export class MeetingService {
  /**
   * Creates a new meeting room.
   */
  static async createMeeting(
    hostId: string,
    maxParticipants?: number
  ): Promise<{ success: boolean; meetingId: string; message?: string }> {
    try {
      const body: any = { hostId };
      if (maxParticipants) body.maxParticipants = maxParticipants;

      const response = await fetch(`${API_URL}/api/meetings`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = (await response.json()) as ApiResponse;

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
   * Validates if a meeting code exists and is active.
   */
  static async validateMeeting(meetingId: string): Promise<{
    success: boolean;
    meeting?: Meeting;
    maxParticipants?: number;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/${meetingId}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });

      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Reunión no encontrada o expirada",
        };
      }

      return {
        success: true,
        meeting: data.meeting,
        maxParticipants: data.maxParticipants || data.meeting?.maxParticipants || 10,
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al validar reunión",
      };
    }
  }

  /**
   * Gets all meetings created by a user.
   */
  static async getUserMeetings(userId: string): Promise<{
    success: boolean;
    meetings?: Meeting[];
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/user/${userId}`);
      const data = (await response.json()) as ApiResponse;

      if (!response.ok || !data.success) {
        return {
          success: false,
          message: data.message || "Error al obtener reuniones",
        };
      }

      return {
        success: true,
        meetings: data.meetings || [],
      };
    } catch (error: any) {
      return {
        success: false,
        message: error.message || "Error de red al obtener reuniones",
      };
    }
  }

  /**
   * Closes a meeting by meetingId.
   */
  static async closeMeeting(meetingId: string): Promise<{
    success: boolean;
    message?: string;
  }> {
    try {
      const response = await fetch(`${API_URL}/api/meetings/${meetingId}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as ApiResponse;

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
