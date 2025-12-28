
import React from 'react';

const LogicBlock: React.FC<{ title: string; logic: string }> = ({ title, logic }) => (
  <div className="mt-6 font-mono text-[10px] bg-black/40 border border-primary/20 p-4 rounded-sm relative group overflow-hidden">
    <div className="absolute top-0 right-0 p-1 text-[8px] text-primary/30 uppercase tracking-tighter">PROOF_STRAT</div>
    <div className="text-primary/40 mb-2 font-black tracking-widest uppercase">{title}</div>
    <div className="text-primary glow-cyan whitespace-pre-wrap leading-relaxed">
      {logic}
    </div>
  </div>
);

const HowItWorks: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-6 py-20 relative z-10">
      <div className="text-center mb-24">
        <div className="inline-block mb-4 px-3 py-1 border border-primary/20 text-primary text-[8px] font-mono tracking-[0.5em] uppercase">
          LOGIC_LAYER_v1.0.0 // PRODUCTION_STABLE
        </div>
        <h1 className="text-5xl font-display font-black mb-6 tracking-tighter uppercase glow-cyan">Privacy for Everyone.</h1>
        <p className="text-xl text-white/40 font-mono tracking-tight leading-relaxed max-w-2xl mx-auto">
          Built for the average Joe, powered by elite cryptographic field theory. 
          G3ZKP ensures your keys stay on your device, always.
        </p>
      </div>

      <div className="space-y-40">
        <div className="relative">
          <div className="absolute -left-16 -top-10 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none">01</div>
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-display font-black mb-6 text-primary tracking-widest uppercase italic">Key Generation</h3>
              <p className="text-white/60 leading-relaxed font-mono text-sm mb-6">
                When you activate G3ZKP, your device runs the NaCl cryptographic engine. It generates a unique pair of keys. Think of it like a lock and a master key that never leaves your pocket. Even if we wanted to, we couldn't open your door.
              </p>
              <LogicBlock 
                title="Sovereign Identity Assignment"
                logic={`(sk, pk) ← KeyGen(NaCl)\n∀ msg : AEAD_Dec(sk, AEAD_Enc(pk, msg)) = msg\nKeys are 4096-bit local-only storage.`}
              />
            </div>
            <div className="w-full md:w-72 h-72 spatial-glass flex items-center justify-center border-primary/20 group hover:border-primary/50 transition-all">
              <svg className="w-24 h-24 text-primary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"></path></svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -right-16 -top-10 text-[12rem] font-black text-white/[0.02] select-none text-right pointer-events-none">02</div>
          <div className="flex flex-col md:flex-row-reverse gap-16 items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-display font-black mb-6 text-secondary tracking-widest uppercase italic">The Deterrent Shield</h3>
              <p className="text-white/60 leading-relaxed font-mono text-sm mb-6">
                To keep the network safe without spying, we use "Decentralized Deterrence". Our system recognizes digital patterns used by traffickers—like unusual EXIF stripping or device signature hacks—and isolates them from the network immediately. No reports to authorities, just pure network exclusion.
              </p>
              <LogicBlock 
                title="Anti-Trafficking Pattern Logic"
                logic={`Pattern_Match(metadata) ⇒ Risk_Score\nIf Risk_Score > Threshold: Network_Exclusion(user)\nNo Content Inspection. Zero Cooperation Policy.`}
              />
            </div>
            <div className="w-full md:w-72 h-72 spatial-glass flex items-center justify-center border-secondary/20 group hover:border-secondary/50 transition-all">
              <svg className="w-24 h-24 text-secondary animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"></path></svg>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="absolute -left-16 -top-10 text-[12rem] font-black text-white/[0.02] select-none pointer-events-none">03</div>
          <div className="flex flex-col md:flex-row gap-16 items-start">
            <div className="flex-1">
              <h3 className="text-3xl font-display font-black mb-6 text-white tracking-widest uppercase italic">X3DH & Double Ratchet</h3>
              <p className="text-white/60 leading-relaxed font-mono text-sm mb-6">
                Your messages use the most advanced "Double Ratchet" protocol. It means every single message has a new key. Even if someone stole one key, they couldn't read your past or future messages. It's like a code that changes every second.
              </p>
              <LogicBlock 
                title="Symmetric Ratchet Protocol"
                logic={`k_i+1 ← Ratchet(k_i, entropy)\nc ← AES-GCM(k_i, payload ⊕ noise)\nForward Secrecy = True. Future Secrecy = True.`}
              />
            </div>
            <div className="w-full md:w-72 h-72 spatial-glass flex items-center justify-center border-white/10 group hover:border-white/30 transition-all">
              <svg className="w-24 h-24 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path></svg>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-40 text-center bg-primary/5 p-16 spatial-glass border-primary/10 relative overflow-hidden group">
        <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-primary to-transparent"></div>
        <h2 className="text-2xl font-display font-black mb-4 uppercase tracking-[0.2em]">"Simple for you. Impossible for them."</h2>
        <p className="text-primary/40 font-mono text-xs uppercase tracking-widest">— G3ZKP Protocol Theorem (v1.0.0)</p>
      </div>
    </div>
  );
};

export default HowItWorks;
