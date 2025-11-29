import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { MeetingService, type Meeting } from '../services/MeetingService';
import { AuthService } from '../services/AuthService';

const VideoCall = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [meeting, setMeeting] = useState<Meeting | null>(null);
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [hasJoined, setHasJoined] = useState(false);

  const meetingId = searchParams.get('room');

  useEffect(() => {
    if (!meetingId) {
      navigate('/start-meeting');
      return;
    }

    joinMeeting();

    // IMPORTANTE: Cleanup al salir de la página
    return () => {
      if (hasJoined && meetingId) {
        handleLeaveMeeting();
      }
    };
  }, [meetingId]);

  /**
   * Join the meeting and increment participant count
   */
  const joinMeeting = async () => {
    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        navigate('/login');
        return;
      }

      if (!meetingId) return;

      // First check if can join
      const canJoinResult = await MeetingService.canJoinMeeting(meetingId);

      if (!canJoinResult.success || !canJoinResult.canJoin) {
        setError(canJoinResult.message || "No puedes unirte a esta reunión");
        setTimeout(() => navigate('/start-meeting'), 3000);
        return;
      }

      // Join the meeting
      const joinResult = await MeetingService.joinMeeting(meetingId, user.id);

      if (!joinResult.success) {
        setError(joinResult.message || "Error al unirse");
        setTimeout(() => navigate('/start-meeting'), 3000);
        return;
      }

      setMeeting(joinResult.meeting || null);
      setHasJoined(true);
      setLoading(false);

    } catch (err: any) {
      setError(err.message || "Error inesperado");
      setLoading(false);
    }
  };

  /**
   * Leave the meeting and decrement participant count
   */
  const handleLeaveMeeting = async () => {
    if (!meetingId || !hasJoined) return;

    try {
      await MeetingService.leaveMeeting(meetingId);
      setHasJoined(false);
    } catch (err) {
      console.error("Error al salir de la reunión:", err);
    }
  };

  /**
   * User clicks "Leave Meeting" button
   */
  const onLeaveMeeting = async () => {
    await handleLeaveMeeting();
    navigate('/start-meeting');
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-white mx-auto mb-4"></div>
          <p className="text-white text-lg">Uniéndose a la reunión...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="text-center bg-white rounded-lg p-8 max-w-md">
          <div className="text-red-500 text-5xl mb-4">⚠️</div>
          <h2 className="text-xl font-bold text-gray-800 mb-2">Error</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => navigate('/start-meeting')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Volver al inicio
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 flex flex-col">
      {/* Header with meeting info */}
      <header className="bg-gray-800 text-white p-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold">
              📋 Reunión: {meeting?.meetingId}
            </h1>
            {meeting && (
              <p className="text-sm text-gray-300">
                👥 {MeetingService.getMeetingStats(meeting)}
              </p>
            )}
          </div>
          <button
            onClick={onLeaveMeeting}
            className="bg-red-600 hover:bg-red-700 px-6 py-2 rounded-lg font-semibold
                       transition-all"
          >
            🚪 Salir
          </button>
        </div>
      </header>

      {/* Video Grid */}
      <main className="flex-1 p-4">
        <div className="container mx-auto h-full">
          {/* 
            AQUÍ VA TU LÓGICA DE WEBRTC/VIDEOLLAMADA 
            Por ejemplo, con simple-peer, PeerJS, o tu implementación actual
          */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full">
            {/* Video placeholder */}
            <div className="bg-gray-800 rounded-lg flex items-center justify-center aspect-video">
              <div className="text-center text-white">
                <div className="text-6xl mb-4">🎥</div>
                <p className="text-lg">Tu video</p>
              </div>
            </div>

            {/* More video placeholders based on participant count */}
            {meeting && Array.from({ length: (meeting.participantCount || 1) - 1 }).map((_, i) => (
              <div key={i} className="bg-gray-800 rounded-lg flex items-center justify-center aspect-video">
                <div className="text-center text-white">
                  <div className="text-6xl mb-4">👤</div>
                  <p className="text-lg">Participante {i + 1}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {/* Controls */}
      <footer className="bg-gray-800 p-4">
        <div className="container mx-auto flex justify-center gap-4">
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full">
            🎤
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full">
            📹
          </button>
          <button className="bg-blue-600 hover:bg-blue-700 p-4 rounded-full">
            🖥️
          </button>
          <button 
            onClick={onLeaveMeeting}
            className="bg-red-600 hover:bg-red-700 p-4 rounded-full"
          >
            📞
          </button>
        </div>
      </footer>
    </div>
  );
};

export default VideoCall;