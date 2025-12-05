/**
 * Home page component that serves as the landing page for VCweb.
 * Accessible version — improved contrast, focus visibility and semantic roles
 */

import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0066A1] flex flex-col">
      {/* Header */}
      <header
        className="flex justify-between items-center px-4 py-4 md:px-8 md:py-6"
        role="banner"
      >
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/Logo.jpg"
              alt="Logotipo de VCweb"
              className="w-10 h-10 md:w-14 md:h-14"
            />
          </div>
        </div>

        <nav
          className="flex items-center gap-3 md:gap-6"
          aria-label="Navegación principal"
        >
          <Link
            to="/about"
            className="home-link font-semibold text-sm md:text-lg
             drop-shadow-[0_1px_2px_rgba(0,0,0,0.45)]
             focus-visible:outline-2 focus-visible:outline-white
             rounded-md px-1 transition"
          >
            Sobre nosotros
          </Link>

          <Link
            to="/login"
            className="bg-white text-[#005f99] font-semibold px-3 py-2 md:px-5 md:py-2 rounded-lg hover:bg-[#e8f6ff] transition shadow-md focus-visible:outline focus-visible:outline-2 focus-visible:outline-white"
          >
            Iniciar sesión
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main
        className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6 relative"
        role="main"
      >
        <h1 className="text-white text-4xl md:text-5xl font-bold leading-tight">
          Bienvenido a VCweb
        </h1>

        <p className="text-white text-lg md:text-xl font-light max-w-xl leading-relaxed">
          Conecta, crea y gestiona tus proyectos digitales.
        </p>
        
        <img
          src="/login.png"
          alt="Ilustración de personas colaborando digitalmente"
          className="w-[380px] md:w-[420px] h-auto drop-shadow-xl mt-0 mx-auto"
        />
      </main>

      {/* Footer */}
      <footer
        className="text-center text-white py-8 space-y-2"
        role="contentinfo"
      >
        <Link
          to="/Sitemap"
          className="home-link font-semibold text-lg
             focus-visible:ring-2 focus-visible:ring-white px-2 rounded-md"
        >
          Mapa del sitio
        </Link>

        <p className="text-sm font-light">
          © 2025 VCweb. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
