/**
 * Login page component that handles user authentication via email/password
 * and social providers (Google and Github). Includes form validation,
 * password visibility toggle, loading state handling, and error feedback.
 *
 * @component
 * @returns {JSX.Element} The rendered Login page.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthService } from "../services/AuthService";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      setError("Por favor completa todos los campos");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const result = await AuthService.loginWithEmail(email, password);
      
      if (result.success) {
        AuthService.saveUserToStorage(result.user);
        navigate("/start-meeting");
      } else {
        setError(result.message || "Error al iniciar sesión");
      }
    } catch (error: any) {
      setError(error.message || "Error al iniciar sesión");
    } finally {
      setLoading(false);
    }
  };

  // Cambiado para aceptar GitHub
  const handleSocialLogin = async (provider: "google" | "github") => {
    setLoading(true);
    setError("");

    try {
      const result = await AuthService.loginWithProvider(provider);
      
      if (result.success) {
        AuthService.saveUserToStorage(result.user);
        navigate("/start-meeting");
      } else {
        setError(result.message || `Error al iniciar sesión con ${provider}`);
      }
    } catch (error: any) {
      setError(error.message || `Error al iniciar sesión con ${provider}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Conéctate con tu equipo hoy" showMenu={false} />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-3xl font-bold text-gray-800 text-center mb-2">
              Inicia sesión
            </h2>
            <p className="text-gray-600 text-center mb-8">
              Accede a tu cuenta para continuar
            </p>

            {error && (
              <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg text-center">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Correo electrónico
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@correo.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfff] focus:border-transparent"
                  required
                  disabled={loading}
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-gray-700 font-semibold mb-2"
                >
                  Contraseña
                </label>

                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#00bfff] focus:border-transparent pr-12"
                    required
                    disabled={loading}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    disabled={loading}
                  >
                    {showPassword ? (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                        />
                      </svg>
                    ) : (
                      <svg
                        className="w-5 h-5"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                        />
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                        />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              <div className="text-center">
                <Link
                  to="/forgot-password"
                  className="text-[#00bfff] hover:underline font-medium"
                >
                  ¿Olvidaste tu contraseña?
                </Link>
              </div>

              <button 
                type="submit" 
                className="btn w-full"
                disabled={loading}
              >
                {loading ? "Cargando..." : "Iniciar sesión"}
              </button>
            </form>

            <p className="text-center mt-6 text-gray-700">
              ¿No tienes cuenta?{" "}
              <Link
                to="/register"
                className="text-[#00bfff] hover:underline font-semibold"
              >
                Regístrate Aquí
              </Link>
            </p>

            <div className="flex items-center my-6">
              <div className="flex-1 border-t border-gray-300"></div>
              <span className="px-4 text-gray-500 font-medium">o</span>
              <div className="flex-1 border-t border-gray-300"></div>
            </div>

            {/* Botones de Google y GitHub */}
            <div className="flex justify-center gap-6">

              {/* GOOGLE */}
              <button 
                onClick={() => handleSocialLogin("google")}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-white border-2 border-gray-200 flex items-center justify-center hover:border-[#00bfff] hover:shadow-md transition"
              >
                <svg className="w-6 h-6" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </button>

              {/* GITHUB */}
              <button 
                onClick={() => handleSocialLogin("github")}
                disabled={loading}
                className="w-12 h-12 rounded-full bg-black flex items-center justify-center hover:bg-gray-800 hover:shadow-md transition"
              >
                <svg 
                  className="w-7 h-7" 
                  fill="white" 
                  viewBox="0 0 24 24"
                >
                  <path d="M12 0.5C5.37 0.5 0 5.87 0 12.5c0 5.29 3.438 9.773 8.207 11.363.6.11.793-.26.793-.577v-2.234c-3.338.726-4.033-1.61-4.033-1.61-.546-1.387-1.333-1.756-1.333-1.756-1.09-.745.083-.73.083-.73 1.205.085 1.84 1.237 1.84 1.237 1.07 1.834 2.807 1.304 3.492.997.108-.775.418-1.305.762-1.604-2.665-.304-5.466-1.36-5.466-6.053 0-1.337.47-2.431 1.236-3.286-.124-.303-.536-1.523.117-3.176 0 0 1.008-.323 3.3 1.254a11.4 11.4 0 0 1 3.003-.404c1.018.005 2.045.138 3.003.404 2.29-1.577 3.297-1.254 3.297-1.254.655 1.653.243 2.873.12 3.176.77.855 1.235 1.949 1.235 3.286 0 4.704-2.807 5.745-5.48 6.043.43.372.823 1.103.823 2.222v3.293c0 .32.192.694.8.576C20.565 22.27 24 17.79 24 12.5 24 5.87 18.63.5 12 .5z"/>
                </svg>
              </button>

            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Login;
