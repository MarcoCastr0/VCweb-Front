import { io, type Socket } from "socket.io-client"

const SOCKET_URL = import.meta.env.VITE_VOICE_SOCKET_URL || "http://localhost:3003"

/**
 * Service class for managing Socket.io connections to the voice signaling server (Backend 3).
 * Handles WebRTC signaling, room management, and media state synchronization.
 */
class SocketService {
  /** The active Socket.io connection instance */
  private socket: Socket | null = null

  /**
   * Establishes a connection to the voice signaling server.
   * @param userId - The unique identifier for the connecting user
   * @param token - Optional JWT token for authentication against Backend 1
   * @returns The connected Socket instance
   */
  connect(userId: string, token?: string): Socket {
    if (this.socket?.connected) {
      return this.socket
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId,
        token,
      },
    })

    this.socket.on("connect", () => {
      console.log("[VoiceSocket] Connected:", this.socket?.id)
    })

    this.socket.on("disconnect", (reason) => {
      console.log("[VoiceSocket] Disconnected:", reason)
    })

    this.socket.on("connect_error", (error) => {
      console.error("[VoiceSocket] Connection error:", error.message)
    })

    return this.socket
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  getSocket(): Socket | null {
    return this.socket
  }

  // Unirse a una sala
  joinRoom(roomId: string, displayName: string): void {
    this.socket?.emit("join-room", { roomId, displayName })
  }

  // Salir de una sala
  leaveRoom(roomId: string): void {
    this.socket?.emit("leave-room", { roomId })
  }

  // Señalización WebRTC
  sendOffer(targetSocketId: string, offer: RTCSessionDescriptionInit): void {
    this.socket?.emit("webrtc-offer", { targetSocketId, offer })
  }

  sendAnswer(targetSocketId: string, answer: RTCSessionDescriptionInit): void {
    this.socket?.emit("webrtc-answer", { targetSocketId, answer })
  }

  sendIceCandidate(targetSocketId: string, candidate: RTCIceCandidateInit): void {
    this.socket?.emit("ice-candidate", { targetSocketId, candidate })
  }

  // Cambiar estado de medios
  updateMediaState(roomId: string, isAudioEnabled: boolean, isVideoEnabled: boolean): void {
    this.socket?.emit("media-state-change", {
      roomId,
      isAudioEnabled,
      isVideoEnabled,
    })
  }

  // Listeners
  onRoomParticipants(callback: (data: any) => void): void {
    this.socket?.on("room-participants", callback)
  }

  onParticipantJoined(callback: (data: any) => void): void {
    this.socket?.on("participant-joined", callback)
  }

  onParticipantLeft(callback: (data: any) => void): void {
    this.socket?.on("participant-left", callback)
  }

  onMediaStateChanged(callback: (data: any) => void): void {
    this.socket?.on("media-state-changed", callback)
  }

  onWebRTCOffer(callback: (data: any) => void): void {
    this.socket?.on("webrtc-offer", callback)
  }

  onWebRTCAnswer(callback: (data: any) => void): void {
    this.socket?.on("webrtc-answer", callback)
  }

  onIceCandidate(callback: (data: any) => void): void {
    this.socket?.on("ice-candidate", callback)
  }

  onError(callback: (data: any) => void): void {
    this.socket?.on("error", callback)
  }

  onRoomFull(callback: (data: any) => void): void {
    this.socket?.on("room-full", callback)
  }

  onIceServers(callback: (data: any) => void): void {
    this.socket?.on("ice-servers", callback)
  }
}

export const socketService = new SocketService()
