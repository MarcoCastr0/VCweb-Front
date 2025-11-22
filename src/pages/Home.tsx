import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0aa6df] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-4 py-4 md:px-8 md:py-6">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-14 h-14 md:w-20 md:h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img
              src="/Logo.jpg"
              alt="VCweb Logo"
              className="w-10 h-10 md:w-14 md:h-14"
            />
          </div>
        </div>

        {/* Nav */}
        <nav className="flex items-center gap-3 md:gap-6">
          <Link
            to="/about"
            className="text-white font-semibold text-sm md:text-lg hover:opacity-80 transition"
          >
            Sobre nosotros
          </Link>

          <Link
            to="/login"
            className="bg-white text-[#00bfff] px-3 py-1.5 md:px-5 md:py-2 rounded-lg font-semibold text-sm md:text-base hover:shadow-lg transition"
          >
            Iniciar sesión
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6 relative">
        {/* Título */}
        <h1 className="text-white text-5xl font-bold">Bienvenido a VCweb</h1>

        {/* Subtítulo */}
        <p className="text-white text-xl font-light max-w-xl">
          Conecta , crea y gestiona tus
          <br />
          proyectos digitales.
        </p>

        {/* Ruedas flotando arriba */}
        <img
          src="/rueda.png"
          alt="Rueda pequeña"
          className="w-50 h-50 opacity-90 absolute left-[30%] top-[25%]"
        />

        {/* Imagen principal más centrada */}
        <img
          src="/login.png"
          alt="Imagen Home"
          className="w-[420px] h-auto drop-shadow-xl mt-0 mx-auto"
        />
      </main>

      {/* Footer */}
      <footer className="text-center text-white py-8 space-y-2">
        <Link to="/Sitemap" className="hover:underline font-semibold text-lg">
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
