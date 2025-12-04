import { useEffect, useRef, useState, useCallback } from 'react';
import { socketService } from '../services/socketService';
import { peerService } from '../services/peerService';

interface Participant {
  socketId: string;
  odiserId: string;
  displayName: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  stream?: MediaStream;
}

export const useVideoCall = (roomId: string, userId: string, displayName: string) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(new Map());
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const pendingCalls = useRef<Set<string>>(new Set());

  // Inicializar medios locales
  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error('Error accessing media devices:', err);
      setError('No se pudo acceder a la cámara o micrófono');
      throw err;
    }
  }, []);

  // Llamar a un participante
  const callParticipant = useCallback(async (participant: Participant, stream: MediaStream) => {
    if (pendingCalls.current.has(participant.odiserId)) {
      console.log('Already calling:', participant.odiserId);
      return;
    }

    pendingCalls.current.add(participant.odiserId);

    try {
      console.log('Calling participant:', participant.displayName, participant.odiserId);
      const remoteStream = await peerService.call(participant.odiserId, stream);
      
      setParticipants((prev) => {
        const newMap = new Map(prev);
        newMap.set(participant.socketId, { ...participant, stream: remoteStream });
        return newMap;
      });
    } catch (err) {
      console.error('Error calling participant:', participant.displayName, err);
    } finally {
      pendingCalls.current.delete(participant.odiserId);
    }
  }, []);

  // Unirse a la sala
  const joinRoom = useCallback(async () => {
    try {
      if (!roomId || !userId || !displayName) {
        setError('Faltan datos requeridos');
        return;
      }

      // Inicializar medios
      const stream = await initializeMedia();

      // Conectar socket
      socketService.connect(userId);

      // Inicializar peer
      await peerService.initialize(userId);

      // Configurar listeners antes de unirse
      socketService.onRoomParticipants((data: { participants: Participant[] }) => {
        console.log('Participants in room:', data.participants);
        
        // Agregar participantes al estado
        setParticipants((prev) => {
          const newMap = new Map(prev);
          data.participants.forEach((p) => {
            newMap.set(p.socketId, p);
          });
          return newMap;
        });

        // Llamar a cada participante existente
        data.participants.forEach((participant) => {
          callParticipant(participant, stream);
        });
      });

      socketService.onParticipantJoined((data: Participant) => {
        console.log('New participant joined:', data);
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.set(data.socketId, data);
          return newMap;
        });

        // Llamar al nuevo participante
        callParticipant(data, stream);
      });

      socketService.onParticipantLeft((data: { socketId: string; odiserId: string }) => {
        console.log('Participant left:', data);
        peerService.closeCall(data.odiserId);
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.delete(data.socketId);
          return newMap;
        });
      });

      socketService.onMediaStateChanged((data: {
        socketId: string;
        isAudioEnabled: boolean;
        isVideoEnabled: boolean;
      }) => {
        setParticipants((prev) => {
          const newMap = new Map(prev);
          const participant = newMap.get(data.socketId);
          if (participant) {
            newMap.set(data.socketId, {
              ...participant,
              isAudioEnabled: data.isAudioEnabled,
              isVideoEnabled: data.isVideoEnabled,
            });
          }
          return newMap;
        });
      });

      socketService.onError((data: { message: string }) => {
        console.error('Socket error:', data.message);
        setError(data.message);
      });

      socketService.onRoomFull((data: { message: string }) => {
        console.error('Room full:', data.message);
        setError('La sala está llena');
      });

      // Escuchar llamadas entrantes
      peerService.onCall((remotePeerId, remoteStream) => {
        console.log('Received incoming call from:', remotePeerId);
        setParticipants((prev) => {
          const newMap = new Map(prev);
          // Encontrar el participante por su peer ID (odiserId)
          for (const [socketId, participant] of newMap.entries()) {
            if (participant.odiserId === remotePeerId) {
              newMap.set(socketId, { ...participant, stream: remoteStream });
              break;
            }
          }
          return newMap;
        });
      });

      // Unirse a la sala
      socketService.joinRoom(roomId, displayName);

      setIsConnected(true);
    } catch (err) {
      console.error('Error joining room:', err);
      setError('Error al unirse a la sala');
    }
  }, [roomId, userId, displayName, initializeMedia, callParticipant]);

  // Salir de la sala
  const leaveRoom = useCallback(() => {
    socketService.leaveRoom(roomId);
    peerService.destroy();
    
    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    socketService.disconnect();
    setIsConnected(false);
    setParticipants(new Map());
  }, [roomId, localStream]);

  // Toggle audio
  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        socketService.updateMediaState(roomId, audioTrack.enabled, isVideoEnabled);
      }
    }
  }, [localStream, roomId, isVideoEnabled]);

  // Toggle video
  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        socketService.updateMediaState(roomId, isAudioEnabled, videoTrack.enabled);
      }
    }
  }, [localStream, roomId, isAudioEnabled]);

  // Limpiar al desmontar
  useEffect(() => {
    return () => {
      leaveRoom();
    };
  }, [leaveRoom]);

  return {
    participants,
    localStream,
    localVideoRef,
    isAudioEnabled,
    isVideoEnabled,
    isConnected,
    error,
    joinRoom,
    leaveRoom,
    toggleAudio,
    toggleVideo,
  };
};