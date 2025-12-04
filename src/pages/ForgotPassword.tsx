import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

/**
 * ForgotPassword page component.
 * Allows users to request a password reset email via Firebase.
 */
const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  /**
   * Handles password reset email sending.
   * @param {React.FormEvent} e - Form submit event.
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const auth = getAuth();
      await sendPasswordResetEmail(auth, email);

      setSent(true);
      setEmail("");
    } catch (error: any) {
      console.error("Password reset error:", error);

      // Handle specific Firebase errors
      if (error.code === "auth/user-not-found") {
        setError("No existe una cuenta con este correo");
      } else if (error.code === "auth/invalid-email") {
        setError("Correo electrónico inválido");
      } else {
        setError("Error al enviar el correo. Intenta de nuevo.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="min-h-screen bg-white flex flex-col">
        <Header title="Recuperar Contraseña" showMenu={false} />

        <main className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8 text-center">
            <div className="mb-6">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">✅</span>
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Correo enviado
              </h2>
              <p className="text-gray-600">
                Hemos enviado un enlace de recuperación a tu correo electrónico.
              </p>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 text-left">
              <p className="text-sm text-blue-800 mb-2">
                📧 <strong>Revisa tu bandeja de entrada</strong>
              </p>
              <p className="text-xs text-blue-700">
                Si no ves el correo, revisa tu carpeta de spam o correo no deseado.
                El enlace expira en 1 hora.
              </p>
            </div>

            <button
              onClick={() => navigate("/login")}
              className="w-full bg-[#04A3EA] text-white font-semibold py-3 rounded-lg
                         transition-all hover:bg-[#0388C7] hover:shadow-md"
            >
              Volver al inicio de sesión
            </button>
          </div>
        </main>

        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header title="Recuperar Contraseña" showMenu={false} />

      <main className="flex-1 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md bg-white rounded-xl shadow-md border border-gray-200 p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              ¿Olvidaste tu contraseña?
            </h2>
            <p className="text-gray-600 text-sm">
              Ingresa tu correo electrónico y te enviaremos un enlace para
              restablecer tu contraseña.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700 mb-2"
              >
                Correo electrónico
              </label>
              <input
                id="email"
                type="email"
                placeholder="tu@ejemplo.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg
                           focus:outline-none focus:ring-2 focus:ring-[#04A3EA]
                           disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full bg-[#04A3EA] text-white font-semibold py-3 rounded-lg
                         transition-all hover:bg-[#0388C7] hover:shadow-md
                         disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Enviando..." : "Enviar enlace de recuperación"}
            </button>
          </form>

          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/login")}
              className="text-sm text-[#0066A1] hover:text-[#004F80] font-medium"
            >
              ← Volver al inicio de sesión
            </button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default ForgotPassword;
