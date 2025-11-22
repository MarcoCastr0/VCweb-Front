/**
 * Header component that displays a logo, title, and an optional sidebar menu.
 *
 * @component
 * @param {Object} props - Component properties.
 * @param {string} props.title - Title displayed in the header.
 * @param {boolean} [props.showMenu=false] - Whether to show the menu button.
 * @returns {JSX.Element} Rendered Header component with optional sidebar.
 */

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
      <header
        className="
          bg-gradient-to-r from-[#00bfff] to-[#0096d6]
          px-4 py-3
          sm:px-6 sm:py-4
          flex items-center justify-between
        "
      >
        <Link to="/" className="flex items-center gap-3">
          <div
            className="
              w-14 h-14
              sm:w-20 sm:h-20
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

        <h1 className="text-white text-lg sm:text-2xl font-semibold">
          {title}
        </h1>

        {showMenu ? (
          <button
            ref={buttonRef}
            onClick={() => setOpenMenu(true)}
            className="text-white"
          >
            <svg
              className="w-6 h-6 sm:w-8 sm:h-8"
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

      <div
        ref={menuRef}
        className={`
          fixed top-0 right-0 h-full w-64 bg-[#edf5fc] shadow-xl
          transform transition-transform duration-300 z-50
          ${openMenu ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          <h2 className="text-gray-800 font-semibold text-lg">Menú</h2>
          <button
            onClick={() => setOpenMenu(false)}
            className="text-gray-500 text-2xl font-bold hover:text-gray-700"
          >
            ✕
          </button>
        </div>

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
