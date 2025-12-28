
import React from 'react';
import { Link } from 'react-router-dom';

const Footer: React.FC = () => {
  const linkClass = "hover:text-primary hover:glow-cyan border-b-2 border-transparent hover:border-primary transition-all duration-300 pb-0.5 inline-block cursor-pointer hover:-translate-y-0.5 transform";

  return (
    <footer className="border-t border-primary/10 py-12 px-6 bg-dark/20 backdrop-blur-sm">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        <div className="col-span-1 md:col-span-2">
          <h3 className="text-xs font-mono font-black text-primary mb-4 tracking-widest uppercase">SYSTEM_INFO::G3ZKP_MESSENGER</h3>
          <p className="text-[10px] font-mono text-white/30 max-w-sm leading-relaxed mb-6">
            P2P Direct Network initialized. No centralized database detected. User sovereignty confirmed by 4096-bit RSA local vault. 
            All data streams are routed via authenticated multivector tunnels.
          </p>
          <div className="text-[8px] font-mono text-white/20 uppercase tracking-[0.3em]">
            © {new Date().getFullYear()} G3ZKP_SYSTEMS // PRIVACY_ENABLED // {`{ \u2207 \u2208 \u03A6 }`}
          </div>
        </div>
        
        <div>
          <h4 className="text-[10px] font-mono font-black text-white/60 mb-4 tracking-widest uppercase">MODULES</h4>
          <ul className="space-y-3 text-[10px] font-mono text-white/40">
            <li><Link to="/download" className={linkClass}>OS_DISTRO</Link></li>
            <li><Link to="/pricing" className={linkClass}>LICENSE_GEN</Link></li>
            <li><Link to="/how-it-works" className={linkClass}>ZK_DOCS</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-[10px] font-mono font-black text-white/60 mb-4 tracking-widest uppercase">SUPPORT</h4>
          <ul className="space-y-3 text-[10px] font-mono text-white/40">
            <li><Link to="/support" className={linkClass}>TERMINAL_HELP</Link></li>
            <li><a href="#" className={linkClass}>PRIVACY_MD</a></li>
            <li><a href="#" className={linkClass}>WARRANT_CANARY</a></li>
          </ul>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
