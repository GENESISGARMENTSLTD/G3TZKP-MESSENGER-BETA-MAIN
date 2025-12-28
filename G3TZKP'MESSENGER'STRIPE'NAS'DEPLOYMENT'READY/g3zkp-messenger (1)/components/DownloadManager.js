import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
const DownloadManager = ({ platform }) => {
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(0);
    const [peers, setPeers] = useState(0);
    const getFileData = (p) => {
        switch (p) {
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
    return (_jsxs("div", { className: "spatial-card p-12 rounded-lg border-primary/20 bg-primary/5 relative overflow-hidden group", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "w-24 h-24 bg-primary/10 border-2 border-primary/40 rounded-sm flex items-center justify-center mb-8 relative", children: [_jsx("div", { className: "absolute inset-0 bg-primary/20 animate-ping rounded-sm" }), _jsx("svg", { className: "w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,136,255,0.8)]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })] }), _jsxs("h2", { className: "text-3xl font-display font-black mb-2 tracking-[0.2em] text-white uppercase", children: ["SYSTEM_DEPLOY: ", platform] }), _jsxs("p", { className: "text-primary/60 font-black text-xs mb-10 tracking-[0.4em]", children: ["VER_", fileInfo.label, " // SIZE_", fileInfo.size] }), !downloading ? (_jsx("button", { onClick: startDownload, className: "px-16 py-6 bg-primary text-white font-black text-xl rounded-none skew-x-[-12deg] hover:brightness-110 transition-all shadow-[0_0_40px_rgba(0,136,255,0.3)] group-hover:scale-105", children: _jsx("span", { className: "block skew-x-[12deg]", children: "INITIATE_TRANSFER" }) })) : (_jsxs("div", { className: "w-full max-w-md space-y-6", children: [_jsx("div", { className: "h-2 bg-white/5 rounded-none overflow-hidden border border-white/10", children: _jsx("div", { className: "h-full bg-secondary shadow-[0_0_15px_rgba(0,204,136,1)] transition-all duration-300", style: { width: `${progress}%` } }) }), _jsxs("div", { className: "flex justify-between text-[10px] font-black text-secondary uppercase tracking-[0.3em]", children: [_jsxs("span", { children: ["PROGRESS: ", Math.round(progress), "%"] }), _jsxs("span", { className: "animate-pulse", children: ["PEERS: ", peers, "_DETECTED"] })] })] })), _jsxs("div", { className: "mt-16 pt-10 border-t border-white/5 w-full text-center", children: [_jsx("p", { className: "text-[10px] text-white/30 mb-3 uppercase font-black tracking-[0.5em]", children: "CONTENT_ID_CID" }), _jsxs("code", { className: "text-xs text-primary/80 font-mono break-all bg-black/40 px-4 py-2 border border-primary/20 rounded-sm", children: ["SHA256: ", Math.random().toString(16).slice(2).toUpperCase(), "...", fileInfo.size] })] })] })] }));
};
export default DownloadManager;
