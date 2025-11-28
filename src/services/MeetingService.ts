const API_URL = (import.meta as any).env.VITE_API_URL;

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
