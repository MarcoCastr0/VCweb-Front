/// <reference lib="dom" />

interface Navigator {
  mediaDevices: MediaDevices;
}

interface MediaDevices {
  getUserMedia(constraints: MediaStreamConstraints): Promise<MediaStream>;
}

interface MediaStream {
  getTracks(): MediaStreamTrack[];
  getAudioTracks(): MediaStreamTrack[];
  getVideoTracks(): MediaStreamTrack[];
}

interface MediaStreamTrack {
  enabled: boolean;
  stop(): void;
}

interface HTMLVideoElement {
  srcObject: MediaStream | null;
}

interface RTCSessionDescriptionInit {
  type: RTCSdpType;
  sdp?: string;
}

interface RTCIceCandidateInit {
  candidate?: string;
  sdpMid?: string | null;
  sdpMLineIndex?: number | null;
}

type RTCSdpType = 'offer' | 'answer' | 'pranswer' | 'rollback';
