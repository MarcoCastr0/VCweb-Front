import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';

/**
 * Sitemap page component.
 * Displays navigation links to main sections of the application.
 *
 * @component
 * @returns {JSX.Element} The rendered sitemap page.
 */
const Sitemap = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header title="Mapa del sitio" showMenu={true} />

      <main className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-lg p-10 border border-gray-200">
            <p className="text-gray-700 text-center mb-8 text-lg">
              Accede fácilmente a las secciones principales de VCweb:
            </p>

            <nav className="space-y-4">
              <Link
                to="/"
                className="flex items-center gap-4 text-gray-800 hover:text-[#00bfff] transition group"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium underline">Inicio</span>
              </Link>

              <Link
                to="/login"
                className="flex items-center gap-4 text-gray-800 hover:text-[#00bfff] transition group"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium underline">
                  Iniciar Sesión
                </span>
              </Link>

              <Link
                to="/register"
                className="flex items-center gap-4 text-gray-800 hover:text-[#00bfff] transition group"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium underline">
                  Registrarse
                </span>
              </Link>

              <Link
                to="/forgot-password"
                className="flex items-center gap-4 text-gray-800 hover:text-[#00bfff] transition group"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium underline">
                  Restablecer contraseña
                </span>
              </Link>

              <Link
                to="/about"
                className="flex items-center gap-4 text-gray-800 hover:text-[#00bfff] transition group"
              >
                <div className="w-8 h-8 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 group-hover:scale-110 transition"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                </div>
                <span className="text-lg font-medium underline">
                  Sobre nosotros
                </span>
              </Link>
            </nav>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Sitemap;
