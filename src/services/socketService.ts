import { io, Socket } from 'socket.io-client';

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3003';

class SocketService {
  private socket: Socket | null = null;

  connect(userId: string): Socket {
    if (this.socket?.connected) {
      return this.socket;
    }

    this.socket = io(SOCKET_URL, {
      withCredentials: true,
      auth: {
        userId
      }
    });

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('error', (error: any) => {
      console.error('Socket error:', error);
    });

    return this.socket;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  getSocket(): Socket | null {
    return this.socket;
  }

  // Unirse a una sala
  joinRoom(roomId: string, displayName: string): void {
    this.socket?.emit('join-room', { roomId, displayName });
  }

  // Salir de una sala
  leaveRoom(roomId: string): void {
    this.socket?.emit('leave-room', { roomId });
  }

  // Señalización WebRTC
  sendOffer(targetSocketId: string, offer: RTCSessionDescriptionInit): void {
    this.socket?.emit('webrtc-offer', { targetSocketId, offer });
  }

  sendAnswer(targetSocketId: string, answer: RTCSessionDescriptionInit): void {
    this.socket?.emit('webrtc-answer', { targetSocketId, answer });
  }

  sendIceCandidate(targetSocketId: string, candidate: RTCIceCandidateInit): void {
    this.socket?.emit('ice-candidate', { targetSocketId, candidate });
  }

  // Cambiar estado de medios
  updateMediaState(roomId: string, isAudioEnabled: boolean, isVideoEnabled: boolean): void {
    this.socket?.emit('media-state-change', {
      roomId,
      isAudioEnabled,
      isVideoEnabled
    });
  }

  // Listeners
  onRoomParticipants(callback: (data: any) => void): void {
    this.socket?.on('room-participants', callback);
  }

  onParticipantJoined(callback: (data: any) => void): void {
    this.socket?.on('participant-joined', callback);
  }

  onParticipantLeft(callback: (data: any) => void): void {
    this.socket?.on('participant-left', callback);
  }

  onMediaStateChanged(callback: (data: any) => void): void {
    this.socket?.on('media-state-changed', callback);
  }

  onWebRTCOffer(callback: (data: any) => void): void {
    this.socket?.on('webrtc-offer', callback);
  }

  onWebRTCAnswer(callback: (data: any) => void): void {
    this.socket?.on('webrtc-answer', callback);
  }

  onIceCandidate(callback: (data: any) => void): void {
    this.socket?.on('ice-candidate', callback);
  }

  onError(callback: (data: any) => void): void {
    this.socket?.on('error', callback);
  }

  onRoomFull(callback: (data: any) => void): void {
    this.socket?.on('room-full', callback);
  }

  onIceServers(callback: (data: any) => void): void {
    this.socket?.on('ice-servers', callback);
  }
}

export const socketService = new SocketService();