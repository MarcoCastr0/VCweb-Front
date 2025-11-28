import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { MeetingService } from "../services/MeetingService";
import { AuthService } from "../services/AuthService";

const StartMeeting = () => {
  const [meetingCode, setMeetingCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Creates a new meeting in Backend 1 and redirects to video-call.
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

      const result = await MeetingService.createMeeting(user.id);

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
   * Validates meeting code in Backend 1 and redirects to video-call.
   */
  const handleJoinMeeting = async () => {
    if (!meetingCode.trim()) {
      setError("Por favor ingresa un código de reunión");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const code = meetingCode.toUpperCase().trim();
      const result = await MeetingService.validateMeeting(code);

      if (!result.success) {
        setError(result.message || "Código de reunión inválido");
        return;
      }

      navigate(`/video-call?room=${code}`);
    } catch (err: any) {
      setError(err.message || "Error inesperado al validar reunión");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Inicia una reunion" showMenu={true} />

      <main className="flex-1 w-full px-6 lg:px-16 py-6 flex flex-col lg:flex-row 
                 items-center justify-center gap-16">
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

          <div className="flex gap-3 mb-5">
            <input
              type="text"
              placeholder="Introduce un código"
              value={meetingCode}
              onChange={(e) => setMeetingCode(e.target.value.toUpperCase())}
              maxLength={6}
              disabled={loading}
              className="flex-1 px-4 py-3 border border-gray-300 rounded-lg
                         focus:outline-none focus:ring-2 focus:ring-[#04A3EA]"
            />
            <button
              onClick={handleJoinMeeting}
              disabled={loading}
              className="bg-[#04A3EA] text-white font-semibold px-5 rounded-lg
                         transition-all hover:bg-[#0087C5] shadow-sm disabled:opacity-50"
            >
              {loading ? "..." : "Unirme"}
            </button>
          </div>

          <button 
            type="button" 
            className="btn"
            onClick={handleNewMeeting}
            disabled={loading}
          >
            ✚ Nueva Reunión
          </button>

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
