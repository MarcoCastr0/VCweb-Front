/**
 * Footer component that displays site navigation links and copyright information.
 *
 * @component
 * @returns {JSX.Element} The rendered footer section of the application.
 */

import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer role="contentinfo" className="text-center text-gray-600 py-6 space-y-2">
      <nav aria-label="Footer Navigation">
        <ul className="flex justify-center gap-6">
          <li>
            <Link
              to="/sitemap"
              aria-label="Ir al mapa del sitio"
              className="hover:text-[#00bfff] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#00bfff] focus:ring-offset-2 rounded-sm"
            >
              Mapa del sitio
            </Link>
          </li>

          <li aria-hidden="true">|</li>

          <li>
            <Link
              to="/about"
              aria-label="Leer información sobre nosotros"
              className="hover:text-[#00bfff] hover:underline font-medium focus:outline-none focus:ring-2 focus:ring-[#00bfff] focus:ring-offset-2 rounded-sm"
            >
              Sobre nosotros
            </Link>
          </li>
        </ul>
      </nav>

      <p className="text-sm" aria-label="Derechos de autor">
        © 2025 VCweb. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
