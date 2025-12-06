"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { socketService } from "../services/socketService";
import { peerService } from "../services/peerService";

interface Participant {
  socketId: string;
  odiserId: string;
  displayName: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  stream?: MediaStream;
}

export const useVideoCall = (
  roomId: string,
  userId: string,
  displayName: string
) => {
  const [participants, setParticipants] = useState<Map<string, Participant>>(
    new Map()
  );
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const localVideoRef = useRef<HTMLVideoElement>(null);
  const pendingCalls = useRef<Set<string>>(new Set());
  const isInitialized = useRef(false);

  const initializeMedia = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });

      setLocalStream(stream);
      peerService.setLocalStream(stream);

      if (localVideoRef.current) {
        localVideoRef.current.srcObject = stream;
      }

      return stream;
    } catch (err) {
      console.error("[useVideoCall] Error accessing media devices:", err);
      setError("No se pudo acceder a la cámara o micrófono");
      throw err;
    }
  }, []);

  const callParticipant = useCallback(
    async (participant: Participant, stream: MediaStream) => {
      if (pendingCalls.current.has(participant.odiserId)) {
        console.log("[useVideoCall] Already calling:", participant.odiserId);
        return;
      }

      pendingCalls.current.add(participant.odiserId);

      try {
        console.log(
          "[useVideoCall] Calling participant:",
          participant.displayName,
          participant.odiserId
        );
        const remoteStream = await peerService.call(
          participant.odiserId,
          stream
        );

        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.set(participant.socketId, {
            ...participant,
            stream: remoteStream,
          });
          return newMap;
        });
      } catch (err) {
        console.error(
          "[useVideoCall] Error calling participant:",
          participant.displayName,
          err
        );
      } finally {
        pendingCalls.current.delete(participant.odiserId);
      }
    },
    []
  );

  const joinRoom = useCallback(async () => {
    if (isInitialized.current) {
      console.log("[useVideoCall] Already initialized, skipping");
      return;
    }

    try {
      if (!roomId || !userId || !displayName) {
        setError("Faltan datos requeridos");
        return;
      }

      isInitialized.current = true;

      const stream = await initializeMedia();

      const token = localStorage.getItem("authToken") || undefined;

      socketService.connect(userId, token);

      await peerService.initialize(userId);

      socketService.onRoomParticipants(
        (data: { participants: Participant[] }) => {
          console.log(
            "[useVideoCall] Participants in room:",
            data.participants
          );

          setParticipants((prev) => {
            const newMap = new Map(prev);
            data.participants.forEach((p) => {
              newMap.set(p.socketId, p);
            });
            return newMap;
          });

          data.participants.forEach((participant) => {
            callParticipant(participant, stream);
          });
        }
      );

      socketService.onParticipantJoined((data: Participant) => {
        console.log("[useVideoCall] New participant joined:", data);
        setParticipants((prev) => {
          const newMap = new Map(prev);
          newMap.set(data.socketId, data);
          return newMap;
        });

        callParticipant(data, stream);
      });

      socketService.onParticipantLeft(
        (data: { socketId: string; odiserId: string }) => {
          console.log("[useVideoCall] Participant left:", data);
          peerService.closeCall(data.odiserId);
          setParticipants((prev) => {
            const newMap = new Map(prev);
            newMap.delete(data.socketId);
            return newMap;
          });
        }
      );

      socketService.onMediaStateChanged(
        (data: {
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
        }
      );

      socketService.onError((data: { message: string }) => {
        console.error("[useVideoCall] Socket error:", data.message);
        setError(data.message);
      });

      socketService.onRoomFull((data: { message: string }) => {
        console.error("[useVideoCall] Room full:", data.message);
        setError("La sala está llena");
      });

      peerService.onCall((remotePeerId, remoteStream) => {
        console.log(
          "[useVideoCall] Received incoming call from:",
          remotePeerId
        );
        setParticipants((prev) => {
          const newMap = new Map(prev);
          for (const [socketId, participant] of newMap.entries()) {
            if (participant.odiserId === remotePeerId) {
              newMap.set(socketId, { ...participant, stream: remoteStream });
              break;
            }
          }
          return newMap;
        });
      });

      socketService.joinRoom(roomId, displayName);

      setIsConnected(true);
    } catch (err) {
      console.error("[useVideoCall] Error joining room:", err);
      setError("Error al unirse a la sala");
      isInitialized.current = false;
    }
  }, [roomId, userId, displayName, initializeMedia, callParticipant]);

  const leaveRoom = useCallback(() => {
    console.log("[useVideoCall] Leaving room");
    socketService.leaveRoom(roomId);
    peerService.destroy();

    if (localStream) {
      localStream.getTracks().forEach((track) => track.stop());
    }

    socketService.disconnect();
    setIsConnected(false);
    setParticipants(new Map());
    isInitialized.current = false;
  }, [roomId, localStream]);

  const toggleAudio = useCallback(() => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !audioTrack.enabled;
        setIsAudioEnabled(audioTrack.enabled);
        socketService.updateMediaState(
          roomId,
          audioTrack.enabled,
          isVideoEnabled
        );

        console.log(
          `[toggleAudio] Audio ${audioTrack.enabled ? "enabled" : "disabled"}`
        );
      }
    }
  }, [localStream, roomId, isVideoEnabled]);

  const toggleVideo = useCallback(() => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !videoTrack.enabled;
        setIsVideoEnabled(videoTrack.enabled);
        socketService.updateMediaState(
          roomId,
          isAudioEnabled,
          videoTrack.enabled
        );

        console.log(
          `[toggleVideo] Video ${videoTrack.enabled ? "enabled" : "disabled"}`
        );
      }
    }
  }, [localStream, roomId, isAudioEnabled]);

  // Cleanup on unmount ONLY
  useEffect(() => {
    return () => {
      if (isInitialized.current) {
        console.log("[useVideoCall] Cleaning up on unmount");
        socketService.leaveRoom(roomId);
        peerService.destroy();

        const currentStream = localStream;
        if (currentStream) {
          currentStream.getTracks().forEach((track) => track.stop());
        }

        socketService.disconnect();
        isInitialized.current = false;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // ← Dependencias vacías: solo se ejecuta al desmontar

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
