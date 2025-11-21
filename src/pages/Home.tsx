import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen bg-[#0aa6df] flex flex-col">
      
      {/* Header */}
      <header className="flex justify-between items-center px-8 py-6">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
            <img src="/Logo.jpg" alt="VCweb Logo" className="w-10 h-10" />
          </div>
          
        </div>

        <nav className="flex items-center gap-6">
          <Link 
            to="/about"
            className="text-white font-semibold text-lg hover:opacity-80 transition underline"
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
      <main className="flex-1 flex flex-col items-center justify-center text-center px-8 space-y-6">

        {/* Título */}
        <h1 className="text-white text-5xl font-bold">
          Bienvenido a VCweb
        </h1>

        {/* Subtítulo */}
        <p className="text-white text-xl font-light max-w-xl">
          Conecta , crea y gestiona tus<br />proyectos digitales.
        </p>

        {/* Imagen centrada debajo */}
        <img
          src="/login.png"
          alt="Imagen Home"
          className="w-96 h-auto mt-4 drop-shadow-xl"
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
