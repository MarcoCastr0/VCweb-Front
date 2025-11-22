import { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";

interface HeaderProps {
  title: string;
  showMenu?: boolean;
}

const Header = ({ title, showMenu = false }: HeaderProps) => {
  const [openMenu, setOpenMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Cerrar menú al tocar afuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target as Node) &&
        !buttonRef.current?.contains(event.target as Node)
      ) {
        setOpenMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      {/* Header */}
      <header
        className="
          bg-gradient-to-r from-[#00bfff] to-[#0096d6]
          px-4 py-3             /* Móvil pequeño */
          sm:px-6 sm:py-4       /* Desde tablet hacia arriba */
          flex items-center justify-between
        "
      >
        {/* Logo */}
        <Link to="/" className="flex items-center gap-3">
          <div
            className="
              w-14 h-14            /* Móvil */
              sm:w-20 sm:h-20       /* Pantallas grandes */
              bg-white rounded-full flex items-center justify-center shadow-lg
            "
          >
            <img
              src="/Logo.jpg"
              alt="VCweb Logo"
              className="w-10 h-10 sm:w-14 sm:h-14"
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).style.display = "none";
              }}
            />
          </div>
        </Link>

        {/* Título */}
        <h1 className="text-white text-lg sm:text-2xl font-semibold">
          {title}
        </h1>

        {/* Botón menú */}
        {showMenu ? (
          <button
            ref={buttonRef}
            onClick={() => setOpenMenu(true)}
            className="text-white"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8" /* Más pequeño en móvil */
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        ) : (
          <div className="w-8"></div>
        )}
      </header>

      {/* Sidebar derecho */}
      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-64 bg-[#edf5fc] shadow-xl
          transform transition-transform duration-300 z-50
          ${openMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        {/* Encabezado */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-gray-800 font-semibold text-lg">Menú</h2>
          <button
            onClick={() => setOpenMenu(false)}
            className="text-gray-500 text-2xl font-bold hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        {/* Opciones */}
        <nav className="flex flex-col gap-6 mt-6 px-6 text-gray-800">
          <Link
            to="/profile"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-3 text-md hover:text-[#0096d6]"
          >
            🧑‍💼 Perfil
          </Link>

          <Link
            to="/about"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-3 text-md hover:text-[#0096d6]"
          >
            ℹ️ Sobre nosotros
          </Link>

          <Link
            to="/"
            onClick={() => setOpenMenu(false)}
            className="flex items-center gap-3 text-md text-red-500 hover:text-red-400"
          >
            🔒 Cerrar sesión
          </Link>
        </nav>
      </div>
    </>
  );
};

export default Header;
