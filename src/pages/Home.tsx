import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00bfff] via-[#00a8e8] to-[#0096d6] flex flex-col">
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src="/Logo.jpg" alt="VCweb Logo" className="w-10 h-10" />
          </div>
          <span className="text-white font-bold text-xl">VCweb</span>
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
            className="bg-white text-[#00bfff] px-8 py-2.5 rounded-lg font-bold text-lg hover:shadow-lg transition"
          >
            Iniciar sesión
          </Link>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-8">
        <div className="max-w-7xl w-full grid md:grid-cols-2 gap-16 items-center">
          {/* Text Section */}
          <div className="text-white space-y-4">
            <h1 className="text-6xl font-bold leading-tight">
              Bienvenido a VCweb
            </h1>
            <p className="text-2xl font-light">
              Conecta, crea y gestiona tus proyectos digitales.
            </p>
          </div>

        </div>
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