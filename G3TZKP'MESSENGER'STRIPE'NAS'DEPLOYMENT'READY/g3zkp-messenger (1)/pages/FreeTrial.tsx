
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { licenseManager } from '../services';

const FreeTrial: React.FC = () => {
  const [email, setEmail] = useState('');
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [licenseKey, setLicenseKey] = useState('');
  const [timeLeft, setTimeLeft] = useState(604800); // 7 days in seconds
  const [hasExistingLicense, setHasExistingLicense] = useState(false);
  const [existingLicenseType, setExistingLicenseType] = useState<string | null>(null);

  useEffect(() => {
    checkExistingLicense();
    
    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const checkExistingLicense = async () => {
    const status = await licenseManager.getLicenseStatus();
    if (status.valid) {
      setHasExistingLicense(true);
      setExistingLicenseType(status.type);
      if (status.licenseKey) {
        setLicenseKey(status.licenseKey);
      }
    }
  };

  const formatTime = (seconds: number) => {
    const d = Math.floor(seconds / (3600 * 24));
    const h = Math.floor((seconds % (3600 * 24)) / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${d}d ${h}h ${m}m ${s}s`;
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Create trial license using ZKP license manager
      const license = await licenseManager.createTrialLicense();
      await licenseManager.storeLicense(license);
      
      // Get the license key for display
      const status = await licenseManager.getLicenseStatus();
      if (status.licenseKey) {
        setLicenseKey(status.licenseKey);
      }
      
      setSuccess(true);
    } catch (error) {
      console.error('Failed to create trial license:', error);
    } finally {
      setLoading(false);
    }
  };

  // Show existing license status
  if (hasExistingLicense) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-display font-black mb-4 uppercase tracking-tighter glow-cyan">
          {existingLicenseType === 'lifetime' ? 'LIFETIME_LICENSE_ACTIVE' : 'TRIAL_ACTIVE'}
        </h1>
        <p className="text-xl text-white/60 mb-6 font-mono">
          {existingLicenseType === 'lifetime' 
            ? 'Your lifetime license is verified and active.'
            : 'Your 7-day trial is active. Full features unlocked.'}
        </p>
        {licenseKey && (
          <div className="bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-8 inline-block">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">License Key</p>
            <code className="text-secondary text-lg font-mono font-black tracking-wider">
              {licenseKey}
            </code>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/download" 
            className="px-10 py-4 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all"
          >
            DOWNLOAD_NOW
          </Link>
          {existingLicenseType === 'trial' && (
            <Link 
              to="/pricing" 
              className="px-10 py-4 border-2 border-secondary text-secondary font-black text-lg tracking-widest uppercase hover:bg-secondary hover:text-dark transition-all"
            >
              UPGRADE_TO_LIFETIME
            </Link>
          )}
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8">
          <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h1 className="text-4xl font-display font-black mb-4 uppercase tracking-tighter glow-cyan">TRIAL_ACTIVATED</h1>
        <p className="text-xl text-white/60 mb-6 font-mono">No credit card required. Your 7-day privacy shield is ready.</p>
        {licenseKey && (
          <div className="bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-8 inline-block">
            <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">Your License Key</p>
            <code className="text-secondary text-lg font-mono font-black tracking-wider">
              {licenseKey}
            </code>
          </div>
        )}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link 
            to="/download" 
            className="px-10 py-4 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all"
          >
            DOWNLOAD_G3ZKP
          </Link>
        </div>
        <p className="mt-8 text-white/30 text-xs font-mono">
          License stored locally with ZKP cryptographic verification
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
        <div>
          <h1 className="text-5xl font-display font-black mb-6 uppercase tracking-tighter glow-cyan">7-Day Free Trial</h1>
          <p className="text-xl text-white/60 mb-8 font-mono">Experience absolute digital sovereignty for one week. No strings attached.</p>
          
          <ul className="space-y-4 mb-12">
            {[
              'All features unlocked',
              'Unlimited messages',
              'Unlimited files (up to 1GB)',
              'Group chats (100+ people)',
              'Encrypted voice/video calls'
            ].map((item, i) => (
              <li key={i} className="flex items-center gap-3 text-secondary font-mono text-sm">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {item}
              </li>
            ))}
          </ul>

          <div className="spatial-glass p-6 rounded-lg border-secondary/20">
            <p className="text-[10px] font-black uppercase tracking-widest text-secondary mb-2">TRIAL_COUNTDOWN</p>
            <div className="text-3xl font-mono font-black text-white">{formatTime(timeLeft)}</div>
          </div>
        </div>

        <div className="spatial-glass p-10 rounded-lg border-white/10">
          <form onSubmit={handleSignup} className="space-y-6">
            <div>
              <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">Email Address (Optional)</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-secondary transition-colors"
                placeholder="you@example.com"
              />
            </div>
            
            <p className="text-[10px] text-white/40 font-mono">
              Your license is generated and stored locally using ZKP cryptographic verification. No data is sent to any server.
            </p>
            
            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-secondary text-dark font-black text-xl tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50"
            >
              {loading ? 'GENERATING...' : 'ACTIVATE_TRIAL'}
            </button>
          </form>
          
          <div className="mt-8 text-center">
            <Link to="/pricing" className="text-sm text-primary hover:glow-cyan font-mono font-black tracking-widest uppercase">
              Or buy lifetime license for £29.99
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-16 text-center">
        <p className="text-[10px] text-white/20 font-mono uppercase tracking-widest">
          ZKP Decentralized License • No Central Server • Privacy Preserved
        </p>
      </div>
    </div>
  );
};

export default FreeTrial;
