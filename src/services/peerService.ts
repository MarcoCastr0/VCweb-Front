import Peer, { type MediaConnection } from "peerjs"

const PEER_CONFIG = {
  host: import.meta.env.VITE_PEER_HOST || "localhost",
  port: Number(import.meta.env.VITE_PEER_PORT) || 3003,
  path: "/peerjs",
  secure: import.meta.env.VITE_PEER_SECURE === "true",
  debug: import.meta.env.DEV ? 2 : 0, // Enable debug logging in development
  config: {
    iceServers: [
      { urls: "stun:stun.l.google.com:19302" },
      { urls: "stun:stun1.l.google.com:19302" },
      { urls: "stun:stun2.l.google.com:19302" },
      { urls: "stun:stun3.l.google.com:19302" },
    ],
  },
}

/**
 * Service class for managing PeerJS connections.
 * Handles peer-to-peer media streaming using WebRTC.
 */
class PeerService {
  /** The PeerJS instance */
  private peer: Peer | null = null
  /** Map of active media connections by remote peer ID */
  private currentCalls: Map<string, MediaConnection> = new Map()
  /** Local media stream to share with peers */
  private localStream: MediaStream | null = null

  /**
   * Initializes the PeerJS connection with a given user ID.
   * @param userId - The unique identifier for this peer
   * @returns Promise resolving to the assigned peer ID
   */
  initialize(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.peer && !this.peer.destroyed) {
        console.log("[PeerService] Reusing existing peer:", this.peer.id)
        resolve(this.peer.id)
        return
      }

      console.log("[PeerService] Initializing with config:", PEER_CONFIG)
      this.peer = new Peer(userId, PEER_CONFIG)

      this.peer.on("open", (id) => {
        console.log("[PeerService] ✅ Peer initialized successfully with ID:", id)
        resolve(id)
      })

      this.peer.on("error", (error) => {
        console.error("[PeerService] ❌ Peer error:", error)
        console.error("[PeerService] Error type:", error.type)
        console.error("[PeerService] Error message:", error.message)
        reject(error)
      })

      this.peer.on("close", () => {
        console.log("[PeerService] 🔴 Peer connection closed")
      })

      this.peer.on("disconnected", () => {
        console.log("[PeerService] ⚠️ Peer disconnected, attempting reconnect...")
        this.peer?.reconnect()
      })
    })
  }

  /**
   * Sets the local media stream to be shared with peers.
   * @param stream - The local MediaStream from getUserMedia
   */
  setLocalStream(stream: MediaStream): void {
    console.log("[PeerService] Setting local stream")
    this.localStream = stream
  }

  /**
   * Initiates a call to a remote peer.
   * @param remotePeerId - The ID of the peer to call
   * @param localStream - The local MediaStream to send
   * @returns Promise resolving to the remote MediaStream
   */
  call(remotePeerId: string, localStream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        console.error("[PeerService] Cannot call: Peer not initialized")
        reject(new Error("Peer not initialized"))
        return
      }

      if (this.currentCalls.has(remotePeerId)) {
        console.log("[PeerService] Already in call with:", remotePeerId)
        return
      }

      console.log("[PeerService] Calling peer:", remotePeerId)
      const call = this.peer.call(remotePeerId, localStream)
      this.currentCalls.set(remotePeerId, call)

      const timeout = setTimeout(() => {
        if (!call.open) {
          console.warn("[PeerService] ⏱️ Call timeout for:", remotePeerId)
          this.currentCalls.delete(remotePeerId)
          reject(new Error("Call timeout"))
        }
      }, 15000)

      call.on("stream", (remoteStream) => {
        clearTimeout(timeout)
        console.log("[PeerService] ✅ Received remote stream from:", remotePeerId)
        resolve(remoteStream)
      })

      call.on("error", (error) => {
        clearTimeout(timeout)
        console.error("[PeerService] ❌ Call error with", remotePeerId, ":", error)
        this.currentCalls.delete(remotePeerId)
        reject(error)
      })

      call.on("close", () => {
        clearTimeout(timeout)
        console.log("[PeerService] 🔴 Call closed with:", remotePeerId)
        this.currentCalls.delete(remotePeerId)
      })
    })
  }

  /**
   * Sets up a listener for incoming calls.
   * @param callback - Function to handle incoming calls with remote peer ID and stream
   */
  onCall(callback: (remotePeerId: string, remoteStream: MediaStream) => void): void {
    if (!this.peer) {
      console.error("[PeerService] Cannot setup onCall: Peer not initialized")
      return
    }

    this.peer.on("call", (call) => {
      console.log("[PeerService] 📞 Incoming call from:", call.peer)

      if (this.localStream) {
        call.answer(this.localStream)
        this.currentCalls.set(call.peer, call)

        call.on("stream", (remoteStream) => {
          console.log("[PeerService] ✅ Receiving stream from incoming call:", call.peer)
          callback(call.peer, remoteStream)
        })

        call.on("close", () => {
          console.log("[PeerService] 🔴 Incoming call closed from:", call.peer)
          this.currentCalls.delete(call.peer)
        })

        call.on("error", (error) => {
          console.error("[PeerService] ❌ Incoming call error from", call.peer, ":", error)
          this.currentCalls.delete(call.peer)
        })
      } else {
        console.warn("[PeerService] ⚠️ No local stream, requesting media for incoming call")
        // Fallback: request media if no local stream stored
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((localStream) => {
            console.log("[PeerService] ✅ Media obtained for incoming call")
            this.localStream = localStream
            call.answer(localStream)
            this.currentCalls.set(call.peer, call)

            call.on("stream", (remoteStream) => {
              console.log("[PeerService] ✅ Receiving stream from incoming call:", call.peer)
              callback(call.peer, remoteStream)
            })

            call.on("close", () => {
              console.log("[PeerService] 🔴 Incoming call closed from:", call.peer)
              this.currentCalls.delete(call.peer)
            })

            call.on("error", (error) => {
              console.error("[PeerService] ❌ Incoming call error from", call.peer, ":", error)
              this.currentCalls.delete(call.peer)
            })
          })
          .catch((error) => {
            console.error("[PeerService] ❌ Error answering call:", error)
          })
      }
    })
  }

  /**
   * Gets all active RTCPeerConnections.
   * Used to update tracks when media state changes.
   * @returns Array of RTCPeerConnection objects
   */
  getAllPeers(): RTCPeerConnection[] {
    const peerConnections: RTCPeerConnection[] = []
    this.currentCalls.forEach((call) => {
      if (call.peerConnection) {
        peerConnections.push(call.peerConnection)
      }
    })
    return peerConnections
  }

  // Cerrar una llamada específica
  closeCall(remotePeerId: string): void {
    console.log("[PeerService] Closing call with:", remotePeerId)
    const call = this.currentCalls.get(remotePeerId)
    if (call) {
      call.close()
      this.currentCalls.delete(remotePeerId)
    }
  }

  // Cerrar todas las llamadas
  closeAllCalls(): void {
    console.log("[PeerService] Closing all calls:", this.currentCalls.size)
    this.currentCalls.forEach((call) => call.close())
    this.currentCalls.clear()
  }

  // Destruir el peer
  destroy(): void {
    console.log("[PeerService] Destroying peer service")
    this.closeAllCalls()
    if (this.peer) {
      this.peer.destroy()
      this.peer = null
    }
  }

  getPeer(): Peer | null {
    return this.peer
  }

  getPeerId(): string | null {
    return this.peer?.id || null
  }
}

export const peerService = new PeerService()
