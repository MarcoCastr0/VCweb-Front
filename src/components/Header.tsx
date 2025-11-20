import { Link } from 'react-router-dom';

interface HeaderProps {
  title: string;
  showMenu?: boolean;
}

const Header = ({ title, showMenu = false }: HeaderProps) => {
  return (
    <header className="bg-gradient-to-r from-[#00bfff] to-[#0096d6] px-6 py-4 flex items-center justify-between">
      <Link to="/" className="flex items-center gap-3">
        <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
          <img 
            src="/Logo.jpg" 
            alt="VCweb Logo" 
            className="w-10 h-10"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
        </div>
        <span className="text-white font-bold text-xl">VCweb</span>
      </Link>
      
      <h1 className="text-white text-2xl font-semibold">
        {title}
      </h1>

      {showMenu && (
        <button className="text-white">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      )}
      
      {!showMenu && <div className="w-8"></div>}
    </header>
  );
};

export default Header;