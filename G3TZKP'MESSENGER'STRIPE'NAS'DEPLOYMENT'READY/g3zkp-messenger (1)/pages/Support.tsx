
import React, { useState } from 'react';

interface FAQItemProps {
  question: string;
  answer: string;
}

const FAQItem: React.FC<FAQItemProps> = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div 
      className={`spatial-glass rounded-xl border-white/5 transition-all duration-300 ${isOpen ? 'border-primary/30 bg-primary/5 shadow-[0_0_20px_rgba(0,243,255,0.05)]' : 'hover:border-white/10'}`}
    >
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-6 cursor-pointer font-bold flex justify-between items-center text-left focus:outline-none"
      >
        <span className={`${isOpen ? 'text-primary' : 'text-white'} transition-colors duration-300`}>
          {question}
        </span>
        <span className={`text-white/30 transition-transform duration-500 ease-out ${isOpen ? 'rotate-180 text-primary' : ''}`}>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
        </span>
      </button>
      
      <div 
        className={`grid transition-all duration-500 ease-in-out ${isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
      >
        <div className="overflow-hidden">
          <div className="px-6 pb-6 text-white/60 text-sm border-t border-white/5 pt-4 leading-relaxed font-mono">
            {answer}
          </div>
        </div>
      </div>
    </div>
  );
};

const Support: React.FC = () => {
  const faqs = [
    { q: "Do I need a phone number to sign up?", a: "No. G3ZKP uses unique cryptographic IDs. You never have to share your phone number or any personal identity." },
    { q: "What happens if I lose my phone?", a: "Since we store no data, your messages are lost unless you have a backup of your private key (Secret Recovery Phrase). We recommend writing it down and storing it safely." },
    { q: "Is the £29.99 price really for life?", a: "Yes. Once you buy a license, it is yours forever. No subscriptions, no renewal fees, no exceptions." },
    { q: "Can I use G3ZKP on multiple devices?", a: "Yes. You can import your Secret Recovery Phrase on any number of devices to sync your identity and messages." }
  ];

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
      <div className="text-center mb-16">
        <div className="inline-block mb-4 px-3 py-1 border border-primary/20 text-primary text-[8px] font-mono tracking-[0.5em] uppercase animate-pulse">
          TERMINAL_READY // HELP_MODULE_V4
        </div>
        <h1 className="text-5xl font-display font-black mb-4 tracking-tighter glow-cyan uppercase">Terminal Support</h1>
        <p className="text-white/40 font-mono text-sm tracking-widest uppercase">Encryption assistance for the sovereign user.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-20">
        <div className="spatial-glass p-8 rounded-2xl flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-primary/10 border border-primary/20 rounded-full flex items-center justify-center mb-4 text-primary group-hover:shadow-[0_0_20px_rgba(0,243,255,0.3)] transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
          </div>
          <h3 className="font-mono font-bold text-lg mb-2 text-white">Knowledge Base</h3>
          <p className="text-xs text-white/40 mb-6 font-mono leading-relaxed">Access decrypted manuals on setting up your local privacy shield.</p>
          <button className="text-primary font-mono text-xs font-black tracking-widest hover:glow-cyan transition-all uppercase px-4 py-2 border border-primary/20 hover:bg-primary/5">View Guides →</button>
        </div>
        
        <div className="spatial-glass p-8 rounded-2xl flex flex-col items-center text-center group">
          <div className="w-16 h-16 bg-secondary/10 border border-secondary/20 rounded-full flex items-center justify-center mb-4 text-secondary group-hover:shadow-[0_0_20px_rgba(0,204,136,0.3)] transition-all">
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002-2z"></path></svg>
          </div>
          <h3 className="font-mono font-bold text-lg mb-2 text-white">Secure Uplink</h3>
          <p className="text-xs text-white/40 mb-6 font-mono leading-relaxed">Need direct intervention? Open an encrypted support ticket.</p>
          <button className="text-secondary font-mono text-xs font-black tracking-widest hover:glow-green transition-all uppercase px-4 py-2 border border-secondary/20 hover:bg-secondary/5">Send Message →</button>
        </div>
      </div>

      <div className="max-w-2xl mx-auto mb-32">
        <h2 className="text-2xl font-display font-black mb-12 text-center tracking-[0.1em] uppercase">Frequency Asked [?]</h2>
        <div className="space-y-4">
          {faqs.map((faq, i) => (
            <FAQItem key={i} question={faq.q} answer={faq.a} />
          ))}
        </div>
      </div>

      <div className="spatial-glass p-12 rounded-2xl border-white/10 text-center relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
        <h3 className="font-display font-black text-xl mb-4 uppercase tracking-widest">Security Auditor?</h3>
        <p className="text-xs font-mono text-white/40 mb-8 max-w-lg mx-auto leading-relaxed">
          Our protocol logic is open-source. Found a vulnerability in the ZK-circuit? 
          Submit a proof via our P2P bounty contract.
        </p>
        <button className="px-8 py-3 border border-primary/40 text-primary text-[10px] font-mono font-black tracking-[0.3em] hover:bg-primary hover:text-dark transition-all uppercase">
          Review Source (IPFS)
        </button>
      </div>
    </div>
  );
};

export default Support;
