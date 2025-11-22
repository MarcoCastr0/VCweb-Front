/**
 * Footer component that displays site navigation links and copyright information.
 *
 * @component
 * @returns {JSX.Element} The rendered footer section of the application.
 */
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="text-center text-gray-600 py-6 space-y-2">
      <div className="flex justify-center gap-6">
        <Link to="/sitemap" className="hover:text-[#00bfff] hover:underline font-medium">
          Mapa del sitio
        </Link>
        <span>|</span>
        <Link to="/about" className="hover:text-[#00bfff] hover:underline font-medium">
          Sobre nosotros
        </Link>
      </div>
      <p className="text-sm">
        © 2025 VCweb. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
