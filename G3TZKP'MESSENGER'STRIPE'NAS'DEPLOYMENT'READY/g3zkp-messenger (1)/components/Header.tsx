
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LOGO } from '../constants';

const Header: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <header className="sticky top-0 z-50 p-6">
      <div className="max-w-7xl mx-auto flex items-center justify-between bg-dark/40 border border-primary/20 p-4 spatial-glass rounded-lg">
        <Link to="/" className="flex items-center gap-4 group">
          <div className="text-primary transition-transform duration-700 group-hover:scale-110 group-hover:rotate-12 drop-shadow-[0_0_15px_rgba(0,243,255,0.4)]">
            {LOGO("w-12 h-12")}
          </div>
          <div className="hidden sm:block">
            <h1 className="text-xl font-display font-black tracking-[0.2em] text-white">G3ZKP</h1>
            <p className="text-[9px] font-mono text-primary/60 tracking-[0.3em] uppercase">ZK_PROTOCOL_VER_1.0</p>
          </div>
        </Link>

        <nav className="hidden md:flex gap-10">
          {[
            { name: 'PROTOCOL', path: '/how-it-works' },
            { name: 'LICENSE', path: '/pricing' },
            { name: 'DEPLOY', path: '/download' },
            { name: 'TERMINAL', path: '/support' },
          ].map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`text-[10px] font-mono font-bold tracking-[0.2em] transition-all hover:text-primary ${
                isActive(item.path) ? 'text-primary glow-cyan underline decoration-primary/30 underline-offset-8' : 'text-white/40'
              }`}
            >
              {item.name}
            </Link>
          ))}
        </nav>

        <Link
          to="/free-trial"
          className="px-6 py-2 bg-primary/10 border border-primary/30 text-primary font-mono font-bold text-[10px] tracking-widest hover:bg-primary hover:text-dark transition-all shadow-[0_0_15px_rgba(0,243,255,0.1)] hover:shadow-[0_0_25px_rgba(0,243,255,0.4)]"
        >
          INIT_TRIAL_
        </Link>
      </div>
    </header>
  );
};

export default Header;
