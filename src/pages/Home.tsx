import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0aa6df] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src="/Logo.jpg" alt="VCweb Logo" className="w-14 h-14" />
          </div>
        </div>

        <nav className="flex items-center gap-6">
          <Link
            to="/about"
            className="text-white font-semibold text-lg hover:opacity-80 transition"
          >
            Sobre nosotros
          </Link>

          <Link
            to="/login"
            className="bg-white text-[#00bfff] px-5 py-2 rounded-md font-bold text-base hover:shadow-lg transition"
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
          className="w-50 h-50 opacity-90 absolute left-[30%] top-[28%]"
        />

        {/* Imagen principal más centrada */}
        <img
          src="/login.png"
          alt="Imagen Home"
          className="w-[420px] h-auto drop-shadow-xl mt-4 relative left-[50px]"
        />
      </main>

      {/* Footer */}
      <footer className="text-center text-white py-8 space-y-2">
        <button className="hover:underline font-semibold text-lg">
          Mapa del sitio
        </button>
        <p className="text-sm font-light">
          © 2025 VCweb. Todos los derechos reservados.
        </p>
      </footer>
    </div>
  );
};

export default Home;
