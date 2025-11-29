import { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MicOff, VideoOff, PhoneOff, User } from "lucide-react";
import { WebSocketService } from "../services/WebSocketService";
import { AuthService } from "../services/AuthService";
import { MeetingService } from "../services/MeetingService";

interface Message {
  senderId: string;
  senderName?: string;
  text: string;
  timestamp: string;
}

export default function VideoCall() {
  const [searchParams] = useSearchParams();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [connected, setConnected] = useState(false);
  const [loadingMeeting, setLoadingMeeting] = useState(true);
  const [meetingError, setMeetingError] = useState("");
  const [participantCount, setParticipantCount] = useState(0);
  const [maxParticipants, setMaxParticipants] = useState(10);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const initialized = useRef(false);

  const roomId = searchParams.get("room");
  const currentUser = AuthService.getCurrentUser();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const init = async () => {
      if (!roomId || !currentUser) {
        navigate("/start-meeting");
        return;
      }

      // 1) Validar reunión en Backend 1
      setLoadingMeeting(true);
      setMeetingError("");
      const result = await MeetingService.validateMeeting(roomId);

      if (!result.success) {
        setMeetingError(result.message || "Reunión no válida");
        navigate("/start-meeting");
        return;
      }

      if (!result.meeting?.isActive) {
        setMeetingError("Esta reunión ya no está activa");
        navigate("/start-meeting");
        return;
      }

      setMaxParticipants(result.maxParticipants || 10);
      setLoadingMeeting(false);

      // 2) Conectar WebSocket con Backend 2
      WebSocketService.connect(currentUser.id);

      WebSocketService.onMessage((data) => {
        switch (data.action) {
          case "joined":
            console.log("✅ Unido a la sala:", data.payload);
            setConnected(true);
            setParticipantCount(data.payload.participantCount || 0);
            setMaxParticipants(data.payload.maxParticipants || 10);
            break;

          case "join-error":
            console.error("❌ Error al unirse:", data.payload);
            handleJoinError(data.payload);
            break;

          case "user-joined":
            console.log("👤 Nuevo usuario:", data.payload);
            setParticipantCount(data.payload.participantCount || 0);
            break;

          case "user-left":
            console.log("👋 Usuario salió:", data.payload);
            setParticipantCount(data.payload.participantCount || 0);
            break;

          case "recent-messages":
            if (Array.isArray(data.payload)) {
              setMessages(
                data.payload.map((msg: any) => ({
                  senderId: msg.senderId,
                  senderName: msg.senderName,
                  text: msg.content || msg.text,
                  timestamp: new Date(msg.timestamp).toISOString(),
                }))
              );
            }
            break;

          case "chat-message":
            setMessages((prev) => [
              ...prev,
              {
                senderId: data.payload.senderId,
                senderName: data.payload.senderName,
                text: data.payload.content || data.payload.text,
                timestamp: new Date().toISOString(),
              },
            ]);
            break;
        }
      });

      const checkAndJoin = () => {
        if (WebSocketService.isConnected()) {
          WebSocketService.joinRoom(roomId, currentUser.id);
        } else {
          setTimeout(checkAndJoin, 150);
        }
      };

      checkAndJoin();
    };

    init();

    return () => {
      console.log("🧹 Cleanup VideoCall: leaving room & disconnecting WS");
      WebSocketService.leaveRoom();
      WebSocketService.disconnect();
      initialized.current = false;
    };
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleJoinError = (payload: any) => {
    let errorMessage = "Error al unirse a la reunión";

    switch (payload.code) {
      case "MEETING_NOT_FOUND":
        errorMessage = "La reunión no existe";
        break;
      case "MEETING_INACTIVE":
        errorMessage = "Esta reunión ya no está activa";
        break;
      case "MEETING_FULL":
        errorMessage = `La reunión está llena (${payload.max}/${payload.max} participantes)`;
        break;
      case "ROOMID_REQUIRED":
        errorMessage = "Error: falta el ID de la reunión";
        break;
      default:
        errorMessage = payload.message || "Error desconocido";
    }

    setMeetingError(errorMessage);
    setTimeout(() => navigate("/start-meeting"), 2000);
  };

  const handleSendMessage = () => {
    if (!newMessage.trim() || !connected) return;
    WebSocketService.sendMessage(newMessage, currentUser?.name);
    setNewMessage("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEndCall = () => {
    WebSocketService.leaveRoom();
    WebSocketService.disconnect();
    initialized.current = false;
    navigate("/start-meeting");
  };

  if (loadingMeeting) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Llamada en vivo" showMenu={true} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-gray-600">Validando reunión...</p>
        </main>
        <Footer />
      </div>
    );
  }

  if (meetingError) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header title="Llamada en vivo" showMenu={true} />
        <main className="flex-1 flex items-center justify-center">
          <p className="text-red-600">{meetingError}</p>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Llamada en vivo" showMenu={true} />

      <main className="flex-1 flex flex-col lg:flex-row items-start justify-center gap-10 px-6 py-10">
        {/* Área de video */}
        <div
          className="w-full max-w-3xl bg-white rounded-2xl shadow-md border border-gray-200 p-6 flex flex-col items-center justify-between"
          style={{ height: "390px" }}
        >
          <div className="w-full flex justify-between items-center mb-2">
            <span className="text-sm text-gray-600">
              Room: <strong>{roomId}</strong>
            </span>
            <div className="flex items-center gap-4">
              <span className="text-sm text-gray-600">
                Participantes: <strong>{participantCount}/{maxParticipants}</strong>
              </span>
              <span
                className={`text-sm font-semibold ${
                  connected ? "text-green-600" : "text-red-600"
                }`}
              >
                {connected ? "🟢 Conectado" : "🔴 Desconectado"}
              </span>
            </div>
          </div>

          <div className="flex-1 flex items-center justify-center">
            <User size={120} className="text-gray-400" />
          </div>

          <div className="flex items-center gap-8 pb-2">
            <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <MicOff size={28} className="text-black" />
            </button>

            <button className="p-3 bg-gray-200 rounded-full hover:bg-gray-300 transition">
              <VideoOff size={28} className="text-black" />
            </button>

            <button
              onClick={handleEndCall}
              className="p-3 bg-red-500 rounded-full hover:bg-red-600 transition"
            >
              <PhoneOff size={28} className="text-white" />
            </button>
          </div>
        </div>

        {/* Panel de chat */}
        <div
          className="w-full max-w-xs bg-white rounded-2xl shadow-md border border-gray-200 p-4 flex flex-col"
          style={{ height: "390px" }}
        >
          <div className="flex justify-between items-center mb-2">
            <h3 className="font-semibold text-gray-700">Chat en vivo</h3>
          </div>

          <div className="flex-1 border rounded-lg bg-gray-50 p-3 overflow-y-auto">
            {messages.length === 0 ? (
              <p className="text-gray-400 text-sm text-center mt-4">
                No hay mensajes aún
              </p>
            ) : (
              messages.map((msg, index) => (
                <div
                  key={index}
                  className={`mb-2 p-2 rounded-lg ${
                    msg.senderId === currentUser?.id
                      ? "bg-blue-100 text-right ml-4"
                      : "bg-gray-200 text-left mr-4"
                  }`}
                >
                  <p className="text-xs text-gray-600 mb-1">
                    {msg.senderId === currentUser?.id
                      ? "Tú"
                      : msg.senderName || msg.senderId.substring(0, 8)}
                  </p>
                  <p className="text-sm break-words">{msg.text}</p>
                </div>
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          <div className="mt-3 flex items-center gap-2">
            <input
              type="text"
              placeholder="Envia un mensaje"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              disabled={!connected}
              className="flex-1 border px-3 py-2 rounded-lg focus:outline-none disabled:opacity-50"
            />
            <button
              onClick={handleSendMessage}
              disabled={!connected || !newMessage.trim()}
              className="px-3 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ➤
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
