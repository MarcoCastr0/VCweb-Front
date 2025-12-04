import Peer, { MediaConnection } from 'peerjs';

const PEER_CONFIG = {
  host: import.meta.env.VITE_PEER_HOST || 'localhost',
  port: Number(import.meta.env.VITE_PEER_PORT) || 3003,
  path: '/peerjs',
  secure: import.meta.env.VITE_PEER_SECURE === 'true',
  config: {
    iceServers: [
      { urls: 'stun:stun.l.google.com:19302' },
      { urls: 'stun:stun1.l.google.com:19302' },
    ]
  }
};

class PeerService {
  private peer: Peer | null = null;
  private currentCalls: Map<string, MediaConnection> = new Map();

  initialize(userId: string): Promise<string> {
    return new Promise((resolve, reject) => {
      if (this.peer) {
        resolve(this.peer.id);
        return;
      }

      this.peer = new Peer(userId, PEER_CONFIG);

      this.peer.on('open', (id) => {
        console.log('Peer initialized with ID:', id);
        resolve(id);
      });

      this.peer.on('error', (error) => {
        console.error('Peer error:', error);
        reject(error);
      });
    });
  }

  // Llamar a otro peer
  call(remotePeerId: string, localStream: MediaStream): Promise<MediaStream> {
    return new Promise((resolve, reject) => {
      if (!this.peer) {
        reject(new Error('Peer not initialized'));
        return;
      }

      console.log('Calling peer:', remotePeerId);
      const call = this.peer.call(remotePeerId, localStream);
      this.currentCalls.set(remotePeerId, call);

      call.on('stream', (remoteStream) => {
        console.log('Received remote stream from:', remotePeerId);
        resolve(remoteStream);
      });

      call.on('error', (error) => {
        console.error('Call error:', error);
        this.currentCalls.delete(remotePeerId);
        reject(error);
      });

      call.on('close', () => {
        console.log('Call closed with:', remotePeerId);
        this.currentCalls.delete(remotePeerId);
      });
    });
  }

  // Escuchar llamadas entrantes
  onCall(callback: (remotePeerId: string, remoteStream: MediaStream) => void): void {
    if (!this.peer) {
      console.error('Peer not initialized');
      return;
    }

    this.peer.on('call', (call) => {
      console.log('Incoming call from:', call.peer);

      // Obtener el stream local para responder
      navigator.mediaDevices.getUserMedia({ video: true, audio: true })
        .then((localStream) => {
          call.answer(localStream);
          this.currentCalls.set(call.peer, call);

          call.on('stream', (remoteStream) => {
            console.log('Receiving stream from incoming call:', call.peer);
            callback(call.peer, remoteStream);
          });

          call.on('close', () => {
            console.log('Incoming call closed from:', call.peer);
            this.currentCalls.delete(call.peer);
          });

          call.on('error', (error) => {
            console.error('Incoming call error:', error);
            this.currentCalls.delete(call.peer);
          });
        })
        .catch((error) => {
          console.error('Error answering call:', error);
        });
    });
  }

  // Cerrar una llamada específica
  closeCall(remotePeerId: string): void {
    const call = this.currentCalls.get(remotePeerId);
    if (call) {
      call.close();
      this.currentCalls.delete(remotePeerId);
    }
  }

  // Cerrar todas las llamadas
  closeAllCalls(): void {
    this.currentCalls.forEach((call) => call.close());
    this.currentCalls.clear();
  }

  // Destruir el peer
  destroy(): void {
    this.closeAllCalls();
    if (this.peer) {
      this.peer.destroy();
      this.peer = null;
    }
  }

  getPeer(): Peer | null {
    return this.peer;
  }

  getPeerId(): string | null {
    return this.peer?.id || null;
  }
}

export const peerService = new PeerService();