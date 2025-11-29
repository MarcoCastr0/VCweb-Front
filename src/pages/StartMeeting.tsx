import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MeetingService, type Meeting } from "../services/MeetingService";
import { AuthService } from "../services/AuthService";

const StartMeeting = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const [maxParticipants, setMaxParticipants] = useState(10);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [meetingInfo, setMeetingInfo] = useState<Meeting | null>(null);

  const navigate = useNavigate();

  /**
   * Creates a new meeting in Backend with participant limit and redirects to video-call.
   */
  const handleNewMeeting = async () => {
    setLoading(true);
    setError("");

    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        setError("Debes iniciar sesión primero");
        navigate("/login");
        return;
      }

      const result = await MeetingService.createMeeting(user.id, maxParticipants);

      if (!result.success) {
        setError(result.message || "Error al crear la reunión");
        return;
      }

      navigate(`/video-call?room=${result.meetingId}`);
    } catch (err: any) {
      setError(err.message || "Error inesperado al crear reunión");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Validates meeting code and checks if user can join.
   */
  const handleCheckMeeting = async () => {
    if (!meetingCode.trim()) {
      setError("Por favor ingresa un código de reunión");
      return;
    }

    setLoading(true);
    setError("");
    setMeetingInfo(null);

    try {
      const code = meetingCode.toUpperCase().trim();

      const canJoinResult = await MeetingService.canJoinMeeting(code);

      if (!canJoinResult.success || !canJoinResult.canJoin) {
        setError(canJoinResult.message || "No puedes unirte a esta reunión");
        return;
      }

      setMeetingInfo(canJoinResult.meeting || null);
    } catch (err: any) {
      setError(err.message || "Error al verificar reunión");
    } finally {
      setLoading(false);
    }
  };

  /**
   * Join the validated meeting.
   */
  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) return;

    setLoading(true);
    setError("");

    try {
      const user = AuthService.getCurrentUser();
      if (!user) {
        setError("Debes iniciar sesión primero");
        navigate("/login");
        return;
      }

      const code = meetingCode.toUpperCase().trim();

      const result = await MeetingService.joinMeeting(code, user.id);

      if (!result.success) {
        setError(result.message || "No se pudo unir a la reunión");
        return;
      }

      navigate(`/video-call?room=${code}`);
    } catch (err: any) {
      setError(err.message || "Error inesperado al unirse");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Inicia una reunión" showMenu={true} />

      <main
        className="flex-1 w-full px-6 lg:px-16 py-6 flex flex-col lg:flex-row 
                 items-center justify-center gap-16"
      >
        <section className="max-w-xl">
          <h1 className="text-4xl font-bold text-gray-900 leading-snug mb-4">
            Video conferencias seguras <br /> para tus proyectos digitales.
          </h1>
          <p className="text-gray-600 text-lg leading-relaxed">
            Conéctate, colabora y <br />
            gestiona tus proyectos <br />
            fácilmente con VCweb.
          </p>
        </section>

        <section className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-6">
          <h3 className="text-gray-800 font-semibold text-lg mb-4">
            Comienza Ahora
          </h3>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Join Meeting Section */}
          <div className="mb-6">
            <div className="flex gap-3 mb-3">
              <input
                type="text"
                placeholder="Introduce un código"
                value={meetingCode}
                onChange={(e) => {
                  setMeetingCode(e.target.value.toUpperCase());
                  setMeetingInfo(null);
                }}
                maxLength={6}
                disabled={loading}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#04A3EA]
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                onClick={handleCheckMeeting}
                disabled={loading || !meetingCode.trim()}
                className="bg-[#0066A1] text-white font-semibold px-5 py-2 rounded-lg
                           transition-all hover:bg-[#004F80] hover:shadow-md
                           focus-visible:ring-2 focus-visible:ring-white
                           disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? "..." : "Verificar"}
              </button>
            </div>

            {meetingInfo && (
              <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-3">
                <h4 className="font-semibold text-green-800 mb-2">
                  ✅ Reunión encontrada
                </h4>
                <div className="text-sm text-green-700 space-y-1">
                  <p>📋 Código: <strong>{meetingInfo.meetingId}</strong></p>
                  <p>👥 Participantes: {MeetingService.getMeetingStats(meetingInfo)}</p>
                  <p>
                    {MeetingService.isMeetingFull(meetingInfo)
                      ? "⚠️ Reunión llena"
                      : "✅ Espacio disponible"}
                  </p>
                </div>
                <button
                  onClick={handleJoinMeeting}
                  disabled={loading || MeetingService.isMeetingFull(meetingInfo)}
                  className="mt-3 w-full bg-green-600 text-white font-semibold py-2 rounded-lg
                             hover:bg-green-700 transition-all
                             disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? "Uniéndose..." : "Unirse Ahora"}
                </button>
              </div>
            )}
          </div>

          <div className="border-t border-gray-200 pt-4">
            <p className="text-center text-gray-500 text-sm mb-3">
              O crea una nueva reunión
            </p>

            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full text-left text-sm text-[#0066A1] hover:text-[#004F80] 
                         mb-3 flex items-center justify-between"
            >
              <span>⚙️ Opciones avanzadas</span>
              <span>{showAdvanced ? "▲" : "▼"}</span>
            </button>

            {showAdvanced && (
              <div className="mb-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Máximo de participantes
                </label>
                <div className="flex items-center gap-3">
                  <input
                    type="range"
                    min={2}
                    max={10}
                    value={maxParticipants}
                    onChange={(e) => setMaxParticipants(Number(e.target.value))}
                    disabled={loading}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold text-gray-800 min-w-[3rem] text-center">
                    {maxParticipants}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  Límite de personas que podrán unirse (2-10)
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={handleNewMeeting}
              disabled={loading}
              className="w-full bg-[#04A3EA] text-white font-semibold py-3 rounded-lg
                         transition-all hover:bg-[#0388C7] hover:shadow-md
                         focus-visible:ring-2 focus-visible:ring-white
                         disabled:opacity-50 disabled:cursor-not-allowed
                         flex items-center justify-center gap-2"
            >
              <span className="text-xl">✚</span>
              {loading ? "Creando..." : "Nueva Reunión"}
            </button>

            {!showAdvanced && (
              <p className="text-center text-gray-400 text-xs mt-2">
                Por defecto: máximo {maxParticipants} participantes
              </p>
            )}
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            Crea o únete a una reunión en segundos
          </p>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default StartMeeting;
