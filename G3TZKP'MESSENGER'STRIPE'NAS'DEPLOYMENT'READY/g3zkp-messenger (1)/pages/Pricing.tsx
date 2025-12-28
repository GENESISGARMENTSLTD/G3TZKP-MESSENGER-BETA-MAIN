
import React, { useState, useEffect } from 'react';
import PaymentGateway from '../components/PaymentGateway';
import { licenseManager } from '../services';

const Pricing: React.FC = () => {
  const [isPaying, setIsPaying] = useState(false);
  const [hasLicense, setHasLicense] = useState(false);
  const [licenseType, setLicenseType] = useState<string | null>(null);

  useEffect(() => {
    checkLicense();
  }, []);

  const checkLicense = async () => {
    const status = await licenseManager.getLicenseStatus();
    if (status.valid) {
      setHasLicense(true);
      setLicenseType(status.type);
    }
  };

  const handlePaymentSuccess = (licenseKey: string) => {
    setHasLicense(true);
    setLicenseType('lifetime');
    window.location.hash = '#/download';
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-20 spatial-container">
      <div className="text-center mb-24">
        <h1 className="text-5xl font-display font-black mb-6 tracking-tighter uppercase glow-cyan">Protocol Licensing</h1>
        <p className="text-white/40 text-sm tracking-[0.3em] uppercase">One Payment. Absolute Sovereignty. Infinite Duration.</p>
      </div>

      {hasLicense && licenseType === 'lifetime' ? (
        <div className="spatial-glass p-16 rounded-lg border-secondary/40 bg-gradient-to-br from-secondary/10 to-transparent relative text-center">
          <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
            <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-display font-black text-white mb-4">LICENSE_ACTIVE</h2>
          <p className="text-white/60 font-mono text-sm mb-8">
            Your lifetime license is verified and active.
          </p>
          <button
            onClick={() => window.location.hash = '#/download'}
            className="px-12 py-4 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all"
          >
            DOWNLOAD_G3ZKP
          </button>
        </div>
      ) : (
        <div className="spatial-glass p-16 rounded-lg border-primary/40 bg-gradient-to-br from-primary/10 to-transparent relative group">
          <div className="absolute top-0 right-0 p-6">
            <div className="bg-secondary text-dark text-[10px] font-black px-4 py-1 skew-x-[-12deg] tracking-widest shadow-[0_0_15px_rgba(0,204,136,0.4)]">
              <span className="block skew-x-[12deg]">FULL_ACCESS_GEN_0</span>
            </div>
          </div>
          
          <div className="mb-12">
            <div className="text-8xl font-display font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">£29.99</div>
            <p className="text-primary font-black tracking-[0.4em] text-sm uppercase">LIFETIME_ENCRYPTION_GRANT</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
            {[
              'P2P_PEER_STREAMS',
              'ZERO_LOG_RETENTION',
              'ZK_PROOF_VERIFIER',
              'SECURE_FS_ENCRYPT',
              'MULTI_NODE_SYNC',
              'IMMUTABLE_DISTRO'
            ].map((feature, i) => (
              <div key={i} className="flex items-center gap-4 text-white/70">
                <svg className="w-5 h-5 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                <span className="font-display font-bold tracking-widest text-xs uppercase">{feature}</span>
              </div>
            ))}
          </div>

          {!isPaying ? (
            <button
              onClick={() => setIsPaying(true)}
              className="w-full py-6 bg-primary text-white font-black text-2xl rounded-none skew-x-[-8deg] hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(0,136,255,0.2)]"
            >
              <span className="block skew-x-[8deg]">GENERATE_LICENSE</span>
            </button>
          ) : (
            <div className="animate-in fade-in zoom-in duration-500">
               <PaymentGateway amount={29.99} onSuccess={handlePaymentSuccess} onCancel={() => setIsPaying(false)} />
            </div>
          )}
        </div>
      )}

      <div className="mt-16 flex flex-wrap justify-center gap-10 opacity-30">
        {['STRIPE', 'BITCOIN', 'SOLANA', 'ETHEREUM'].map(m => (
          <span key={m} className="text-[10px] font-black tracking-[0.4em]">{m}</span>
        ))}
      </div>

      <div className="mt-12 text-center">
        <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
          ZKP Cryptographic License Verification • No Central Server • Privacy Preserved
        </p>
      </div>
    </div>
  );
};

export default Pricing;
