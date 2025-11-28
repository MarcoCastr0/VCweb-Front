/**
 * WebSocket service for real-time communication with the backend.
 * Manages connections, room joining, chat messages, and WebRTC signaling.
 */

const WS_URL = (import.meta as any).env.VITE_API_URL2 || "ws://localhost:4000";

export class WebSocketService {
  private static socket: WebSocket | null = null;
  private static roomId: string | null = null;
  private static userId: string | null = null;
  private static isConnecting = false;
  private static messageCallback: ((data: any) => void) | null = null;

  /**
   * Establishes (or reuses) WebSocket connection to the backend server.
   */
  static connect(userId: string): WebSocket {
    // Reusar si ya está abierta o conectando
    if (
      this.socket &&
      (this.socket.readyState === WebSocket.OPEN ||
        this.socket.readyState === WebSocket.CONNECTING)
    ) {
      console.log("♻️ Reusing existing WebSocket connection");
      return this.socket;
    }

    if (this.isConnecting) {
      console.log("⏳ WebSocket connection already in progress");
      return this.socket as WebSocket;
    }

    console.log("🔌 Creating NEW WebSocket connection for user:", userId);
    this.isConnecting = true;
    this.userId = userId;

    this.socket = new WebSocket(`${WS_URL}/?uid=${userId}`);

    this.socket.onopen = () => {
      console.log("✅ WebSocket Connected");
      this.isConnecting = false;
    };

    this.socket.onerror = (error) => {
      console.error("❌ WebSocket Error:", error);
      this.isConnecting = false;
    };

    this.socket.onclose = () => {
      console.log("🔴 WebSocket Disconnected");
      this.isConnecting = false;
      this.socket = null;
      this.roomId = null;
    };

    // Reasignar callback si ya estaba registrada
    if (this.messageCallback) {
      this.socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        this.messageCallback?.(msg);
      };
    }

    return this.socket;
  }

  /**
   * Joins a specific chat room.
   */
  static joinRoom(roomId: string): void {
    if (!this.socket) {
      console.warn("WebSocket not connected yet, cannot join room");
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn("⏳ WebSocket not OPEN, delaying joinRoom");
      setTimeout(() => this.joinRoom(roomId), 100);
      return;
    }

    if (this.roomId === roomId) {
      console.log("ℹ️ Already in room:", roomId);
      return;
    }

    this.roomId = roomId;

    this.socket.send(
      JSON.stringify({
        action: "join",
        payload: { roomId },
      })
    );
  }

  /**
   * Sends a chat message to the current room.
   */
  static sendMessage(text: string, senderName?: string): void {
    if (!this.socket || !this.roomId || !this.userId) {
      console.warn("Not connected to a room, cannot send message");
      return;
    }

    if (this.socket.readyState !== WebSocket.OPEN) {
      console.warn("⏳ WebSocket not OPEN, cannot send message");
      return;
    }

    this.socket.send(
      JSON.stringify({
        action: "chat-message",
        payload: {
          roomId: this.roomId,
          text,
          senderId: this.userId,
          senderName: senderName || this.userId,
        },
      })
    );
  }

  /**
   * Leaves the current room.
   */
  static leaveRoom(): void {
    if (!this.socket || !this.roomId) return;

    if (this.socket.readyState === WebSocket.OPEN) {
      this.socket.send(
        JSON.stringify({
          action: "leave",
        })
      );
    }

    this.roomId = null;
  }

  /**
   * Closes the WebSocket connection.
   */
  static disconnect(): void {
    if (!this.socket) return;

    console.log("🔌 Disconnecting WebSocket");

    if (
      this.socket.readyState === WebSocket.OPEN ||
      this.socket.readyState === WebSocket.CONNECTING
    ) {
      this.socket.close();
    }

    this.socket = null;
    this.roomId = null;
    this.userId = null;
    this.isConnecting = false;
    this.messageCallback = null;
  }

  /**
   * Sets up message listener for incoming WebSocket messages.
   */
  static onMessage(callback: (data: any) => void): void {
    this.messageCallback = callback;

    if (this.socket) {
      this.socket.onmessage = (event) => {
        const msg = JSON.parse(event.data);
        callback(msg);
      };
    }
  }

  /**
   * Checks if socket is open.
   */
  static isConnected(): boolean {
    return !!this.socket && this.socket.readyState === WebSocket.OPEN;
  }
}
