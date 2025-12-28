
import React, { useState, useEffect } from 'react';
import { Platform } from '../types';

interface DownloadManagerProps {
  platform: Platform;
}

const DownloadManager: React.FC<DownloadManagerProps> = ({ platform }) => {
  const [downloading, setDownloading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [peers, setPeers] = useState(0);

  const getFileData = (p: Platform) => {
    switch(p) {
      case 'ios': return { label: 'MOBILE_PWA', file: 'INSTALL_HOME_SCREEN', size: '45MB' };
      case 'android': return { label: 'APK_PACKAGE', file: 'g3zkp_stable.apk', size: '45MB' };
      case 'macos': return { label: 'APP_BUNDLE', file: 'G3ZKP_MacOS.dmg', size: '110MB' };
      case 'linux': return { label: 'APPIMAGE', file: 'g3zkp_universal.AppImage', size: '105MB' };
      default: return { label: 'WIN_EXECUTABLE', file: 'G3ZKP_Setup_v1.exe', size: '120MB' };
    }
  };

  const fileInfo = getFileData(platform);

  useEffect(() => {
    const interval = setInterval(() => {
      setPeers(Math.floor(Math.random() * 50) + 120);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const startDownload = () => {
    if (platform === 'ios') {
      alert('iOS DEPLOYMENT: 1. SHARE 2. ADD TO HOME SCREEN');
      return;
    }
    setDownloading(true);
    setProgress(0);
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          setDownloading(false);
          return 100;
        }
        return prev + Math.random() * 15;
      });
    }, 150);
  };

  return (
    <div className="spatial-card p-12 rounded-lg border-primary/20 bg-primary/5 relative overflow-hidden group">
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30"></div>
      
      <div className="flex flex-col items-center">
        <div className="w-24 h-24 bg-primary/10 border-2 border-primary/40 rounded-sm flex items-center justify-center mb-8 relative">
           <div className="absolute inset-0 bg-primary/20 animate-ping rounded-sm"></div>
           <svg className="w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,136,255,0.8)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
        </div>
        
        <h2 className="text-3xl font-display font-black mb-2 tracking-[0.2em] text-white uppercase">SYSTEM_DEPLOY: {platform}</h2>
        <p className="text-primary/60 font-black text-xs mb-10 tracking-[0.4em]">VER_{fileInfo.label} // SIZE_{fileInfo.size}</p>

        {!downloading ? (
          <button
            onClick={startDownload}
            className="px-16 py-6 bg-primary text-white font-black text-xl rounded-none skew-x-[-12deg] hover:brightness-110 transition-all shadow-[0_0_40px_rgba(0,136,255,0.3)] group-hover:scale-105"
          >
            <span className="block skew-x-[12deg]">INITIATE_TRANSFER</span>
          </button>
        ) : (
          <div className="w-full max-w-md space-y-6">
            <div className="h-2 bg-white/5 rounded-none overflow-hidden border border-white/10">
              <div 
                className="h-full bg-secondary shadow-[0_0_15px_rgba(0,204,136,1)] transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-[10px] font-black text-secondary uppercase tracking-[0.3em]">
              <span>PROGRESS: {Math.round(progress)}%</span>
              <span className="animate-pulse">PEERS: {peers}_DETECTED</span>
            </div>
          </div>
        )}

        <div className="mt-16 pt-10 border-t border-white/5 w-full text-center">
          <p className="text-[10px] text-white/30 mb-3 uppercase font-black tracking-[0.5em]">CONTENT_ID_CID</p>
          <code className="text-xs text-primary/80 font-mono break-all bg-black/40 px-4 py-2 border border-primary/20 rounded-sm">
            SHA256: {Math.random().toString(16).slice(2).toUpperCase()}...{fileInfo.size}
          </code>
        </div>
      </div>
    </div>
  );
};

export default DownloadManager;
