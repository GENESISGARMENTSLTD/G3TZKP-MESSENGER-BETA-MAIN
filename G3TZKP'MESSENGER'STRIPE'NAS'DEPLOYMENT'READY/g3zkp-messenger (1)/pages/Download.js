import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { ipfsDownloadService, licenseManager } from '../services';
const Download = () => {
    const [platform, setPlatform] = useState('windows');
    const [downloading, setDownloading] = useState(false);
    const [progress, setProgress] = useState(null);
    const [hasLicense, setHasLicense] = useState(false);
    const [licenseType, setLicenseType] = useState(null);
    useEffect(() => {
        // Detect platform
        const userAgent = navigator.userAgent.toLowerCase();
        if (userAgent.indexOf('iphone') !== -1 || userAgent.indexOf('ipad') !== -1)
            setPlatform('ios');
        else if (userAgent.indexOf('android') !== -1)
            setPlatform('android');
        else if (userAgent.indexOf('mac') !== -1)
            setPlatform('macos');
        else if (userAgent.indexOf('linux') !== -1)
            setPlatform('linux');
        else
            setPlatform('windows');
        // Check license
        checkLicense();
        // Check for payment success in URL
        const hash = window.location.hash;
        if (hash.includes('payment=success')) {
            handlePaymentSuccess();
        }
    }, []);
    const checkLicense = async () => {
        const status = await licenseManager.getLicenseStatus();
        if (status.valid) {
            setHasLicense(true);
            setLicenseType(status.type);
        }
    };
    const handlePaymentSuccess = async () => {
        // Verify payment from URL params
        const params = new URLSearchParams(window.location.hash.split('?')[1] || '');
        const sessionId = params.get('session_id');
        if (sessionId) {
            // Import dynamically to avoid circular deps
            const { stripeGateway } = await import('../services');
            await stripeGateway.verifyPayment(sessionId);
            await checkLicense();
        }
    };
    const pkg = ipfsDownloadService.getPackage(platform);
    const releaseInfo = ipfsDownloadService.getReleaseInfo();
    const handleDownload = async () => {
        if (platform === 'ios') {
            window.open('https://app.g3zkp.io', '_blank');
            return;
        }
        setDownloading(true);
        setProgress({
            downloaded: 0,
            total: pkg.size,
            percentage: 0,
            speed: 0,
            speedFormatted: '0 B/s',
            eta: 0,
            etaFormatted: 'Calculating...',
            status: 'connecting',
        });
        const blob = await ipfsDownloadService.startDownload(platform, (p) => {
            setProgress(p);
        });
        if (blob) {
            ipfsDownloadService.triggerBrowserDownload(blob, pkg.filename);
        }
        setDownloading(false);
    };
    const handleDirectDownload = () => {
        const url = ipfsDownloadService.getDirectDownloadUrl(platform);
        window.open(url, '_blank');
    };
    const handleMagnetDownload = () => {
        const magnet = ipfsDownloadService.getMagnetLink(platform);
        if (magnet) {
            window.location.href = magnet;
        }
    };
    const platforms = [
        { id: 'windows', label: 'Windows', icon: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M0 3.449L9.75 2.1V11.7H0V3.449zm0 9.15h9.75V21.9L0 20.551V12.599zm10.65-10.449L24 0v11.7h-13.35V2.15zm0 10.449H24V24l-13.35-2.1V12.599z" }) }) },
        { id: 'macos', label: 'macOS', icon: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.82-.779.883-1.454 2.311-1.273 3.674 1.35.104 2.714-.65 3.56-1.664z" }) }) },
        { id: 'android', label: 'Android', icon: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M17.523 15.3414c-.5511 0-.9993-.4486-.9993-.9997s.4482-1.0003.9993-1.0003c.5511 0 .9993.4492.9993 1.0003s-.4482.9997-.9993.9997m-11.046 0c-.5511 0-.9993-.4486-.9993-.9997s.4482-1.0003.9993-1.0003c.5511 0 .9993.4492.9993 1.0003s-.4482.9997-.9993.9997m11.4045-6.02l1.9973-3.4592a.416.416 0 10-.7205-.416l-2.019 3.4963c-1.2144-.5552-2.5804-.8682-4.1393-.8682-1.5589 0-2.9249.313-4.1393.8682l-2.019-3.4963a.416.416 0 10-.7205.416l1.9973 3.4592C3.1255 10.5186 1 13.562 1 17h22c0-3.438-2.1255-6.4814-5.1185-8.6786z" }) }) },
        { id: 'ios', label: 'iOS PWA', icon: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" }) }) },
        { id: 'linux', label: 'Linux', icon: _jsx("svg", { className: "w-5 h-5", fill: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { d: "M12.504 0c-.155 0-.311.001-.465.003-.653.014-1.293.106-1.907.311-1.21.405-2.258 1.18-3.048 2.163-.8.997-1.36 2.166-1.648 3.389-.286 1.212-.343 2.463-.183 3.693.149 1.143.464 2.26.936 3.303.436.965.99 1.877 1.647 2.711.651.828 1.4 1.573 2.218 2.21.771.604 1.593 1.115 2.446 1.536.815.401 1.657.712 2.506.932.926.239 1.857.37 2.784.418.413.02.826.027 1.239.02.652-.014 1.293-.106 1.908-.311 1.21-.405 2.257-1.18 3.047-2.163.8-.997 1.361-2.166 1.649-3.39.286-1.212.343-2.462.182-3.692-.149-1.143-.464-2.26-.935-3.303-.437-.965-.991-1.878-1.648-2.712-.651-.828-1.4-1.572-2.217-2.209-.772-.604-1.593-1.115-2.447-1.536-.815-.401-1.656-.712-2.506-.932-.654-.169-1.312-.265-1.97-.311-.236-.017-.474-.027-.712-.029zm-.041 1.593c.172.001.343.009.512.023.563.042 1.12.134 1.664.295.734.217 1.446.52 2.12.9.639.358 1.246.777 1.803 1.252.55.467 1.052.98 1.496 1.532.454.566.847 1.175 1.163 1.82.317.649.553 1.333.7 2.033.147.698.202 1.41.168 2.115-.039.795-.19 1.57-.45 2.3-.262.733-.626 1.42-1.078 2.036-.463.633-1.01 1.198-1.625 1.668-.594.454-1.241.833-1.922 1.132-.696.304-1.421.521-2.152.641-.752.124-1.509.14-2.259.044-.707-.09-1.4-.271-2.063-.538-.625-.252-1.219-.579-1.766-.973-.523-.378-1.002-.811-1.425-1.293-.432-.493-.807-1.033-1.111-1.607-.302-.571-.53-1.172-.679-1.79-.148-.615-.213-1.247-.196-1.873.018-.706.135-1.403.349-2.074.21-.663.514-1.293.903-1.872.394-.585.87-1.12 1.414-1.583.532-.451 1.127-.833 1.765-1.13.653-.305 1.341-.524 2.039-.652.558-.101 1.123-.15 1.687-.155z" }) }) },
    ];
    const instructions = ipfsDownloadService.getInstallInstructions(platform);
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-6 py-20", children: [_jsxs("div", { className: "text-center mb-16", children: [_jsxs("div", { className: "inline-block mb-4 px-3 py-1 border border-primary/20 text-primary text-[8px] font-mono tracking-[0.5em] uppercase", children: ["VERSION_", releaseInfo.version, " // ", releaseInfo.releaseDate] }), _jsx("h1", { className: "text-4xl font-display font-black mb-4 tracking-tighter uppercase glow-cyan", children: "Download G3ZKP Messenger" }), _jsx("p", { className: "text-white/50 text-sm font-mono", children: "Securely delivered via IPFS & libp2p. SHA-256 verified distributions." })] }), !hasLicense && (_jsxs("div", { className: "mb-12 p-6 spatial-glass border-yellow-500/30 bg-yellow-500/5 rounded-lg text-center", children: [_jsx("p", { className: "text-yellow-500 font-mono text-sm mb-4", children: "\u26A0\uFE0F LICENSE_REQUIRED \u2014 Purchase a license to unlock full features" }), _jsx("button", { onClick: () => window.location.hash = '#/pricing', className: "px-8 py-3 bg-yellow-500 text-dark font-black text-sm tracking-widest uppercase hover:brightness-110 transition-all", children: "GET_LICENSE" })] })), _jsx("div", { className: "flex flex-wrap justify-center gap-4 mb-12", children: platforms.map((p) => (_jsxs("button", { onClick: () => setPlatform(p.id), className: `flex items-center gap-2 px-6 py-3 font-bold transition-all border ${platform === p.id
                        ? 'bg-secondary text-dark border-secondary'
                        : 'bg-transparent text-white border-white/10 hover:border-white/30'}`, children: [p.icon, _jsx("span", { className: "text-xs tracking-widest uppercase", children: p.label })] }, p.id))) }), _jsxs("div", { className: "spatial-glass p-12 rounded-lg border-primary/20 bg-primary/5 relative overflow-hidden", children: [_jsx("div", { className: "absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary to-transparent opacity-30" }), _jsxs("div", { className: "flex flex-col items-center", children: [_jsxs("div", { className: "w-24 h-24 bg-primary/10 border-2 border-primary/40 rounded-sm flex items-center justify-center mb-8 relative", children: [_jsx("div", { className: "absolute inset-0 bg-primary/20 animate-ping rounded-sm" }), _jsx("svg", { className: "w-10 h-10 text-primary drop-shadow-[0_0_10px_rgba(0,136,255,0.8)]", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M4 16v1a2 2 0 002 2h12a2 2 0 002-2v-1m-4-4l-4 4m0 0l-4-4m4 4V4" }) })] }), _jsx("h2", { className: "text-3xl font-display font-black mb-2 tracking-[0.2em] text-white uppercase", children: pkg.filename }), _jsxs("p", { className: "text-primary/60 font-black text-xs mb-6 tracking-[0.4em]", children: ["SIZE: ", pkg.sizeFormatted, " // PLATFORM: ", platform.toUpperCase()] }), !downloading ? (_jsxs("div", { className: "space-y-4 w-full max-w-md", children: [_jsx("button", { onClick: handleDownload, className: "w-full px-16 py-6 bg-primary text-white font-black text-xl skew-x-[-12deg] hover:brightness-110 transition-all shadow-[0_0_40px_rgba(0,136,255,0.3)]", children: _jsx("span", { className: "block skew-x-[12deg]", children: platform === 'ios' ? 'OPEN_PWA' : 'DOWNLOAD_VIA_IPFS' }) }), platform !== 'ios' && (_jsxs("div", { className: "flex gap-4", children: [_jsx("button", { onClick: handleDirectDownload, className: "flex-1 py-3 border border-white/10 text-white/60 font-mono text-xs tracking-widest hover:border-white/30 hover:text-white transition-all uppercase", children: "Direct Link" }), pkg.magnetLink && (_jsx("button", { onClick: handleMagnetDownload, className: "flex-1 py-3 border border-white/10 text-white/60 font-mono text-xs tracking-widest hover:border-white/30 hover:text-white transition-all uppercase", children: "Magnet Link" }))] }))] })) : (_jsxs("div", { className: "w-full max-w-md space-y-6", children: [_jsx("div", { className: "text-center mb-4", children: _jsxs("span", { className: "text-primary font-mono text-sm uppercase tracking-widest", children: [progress?.status === 'connecting' && 'Connecting to IPFS network...', progress?.status === 'downloading' && 'Downloading...', progress?.status === 'verifying' && 'Verifying integrity...', progress?.status === 'complete' && 'Download complete!', progress?.status === 'error' && `Error: ${progress.error}`] }) }), _jsx("div", { className: "h-2 bg-white/5 overflow-hidden border border-white/10", children: _jsx("div", { className: "h-full bg-secondary shadow-[0_0_15px_rgba(0,204,136,1)] transition-all duration-300", style: { width: `${progress?.percentage || 0}%` } }) }), _jsxs("div", { className: "flex justify-between text-[10px] font-black text-secondary uppercase tracking-[0.3em]", children: [_jsxs("span", { children: ["PROGRESS: ", progress?.percentage || 0, "%"] }), _jsxs("span", { children: [progress?.speedFormatted, " \u2022 ETA: ", progress?.etaFormatted] })] })] })), _jsx("div", { className: "mt-12 pt-8 border-t border-white/5 w-full", children: _jsxs("div", { className: "grid grid-cols-2 gap-4 text-[10px] font-mono text-white/40", children: [_jsxs("div", { children: [_jsx("span", { className: "text-white/20 uppercase", children: "IPFS CID:" }), _jsx("div", { className: "text-primary/60 break-all mt-1", children: pkg.ipfsCID })] }), _jsxs("div", { children: [_jsx("span", { className: "text-white/20 uppercase", children: "SHA-256:" }), _jsx("div", { className: "text-secondary/60 break-all mt-1", children: pkg.sha256 })] })] }) })] })] }), _jsxs("div", { className: "mt-12 spatial-glass p-8 rounded-lg border-white/5", children: [_jsx("h3", { className: "text-lg font-display font-black mb-6 text-white uppercase tracking-widest", children: "Installation Instructions" }), _jsx("ol", { className: "space-y-3", children: instructions.map((step, i) => (_jsxs("li", { className: "flex gap-4 text-white/60 text-sm font-mono", children: [_jsxs("span", { className: "text-primary font-black", children: [i + 1, "."] }), step] }, i))) })] }), _jsxs("div", { className: "mt-12 grid grid-cols-1 md:grid-cols-2 gap-8", children: [_jsxs("div", { className: "spatial-glass p-8 rounded-lg border-white/5", children: [_jsxs("h3", { className: "text-lg font-bold mb-3 flex items-center gap-2 text-primary", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M13 10V3L4 14h7v7l9-11h-7z" }) }), "IPFS Powered"] }), _jsx("p", { className: "text-sm text-white/50 font-mono", children: "Downloads are served via decentralized IPFS network. Your download helps other users get the app faster and more securely." })] }), _jsxs("div", { className: "spatial-glass p-8 rounded-lg border-white/5", children: [_jsxs("h3", { className: "text-lg font-bold mb-3 flex items-center gap-2 text-secondary", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" }) }), "Code Verified"] }), _jsx("p", { className: "text-sm text-white/50 font-mono", children: "Every binary is SHA-256 verified. The IPFS CID is immutable. You are guaranteed to run the exact code we published." })] })] })] }));
};
export default Download;
