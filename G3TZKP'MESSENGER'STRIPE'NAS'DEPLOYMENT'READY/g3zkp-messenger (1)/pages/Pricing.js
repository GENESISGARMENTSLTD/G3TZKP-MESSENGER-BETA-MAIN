import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import PaymentGateway from '../components/PaymentGateway';
import { licenseManager } from '../services';
const Pricing = () => {
    const [isPaying, setIsPaying] = useState(false);
    const [hasLicense, setHasLicense] = useState(false);
    const [licenseType, setLicenseType] = useState(null);
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
    const handlePaymentSuccess = (licenseKey) => {
        setHasLicense(true);
        setLicenseType('lifetime');
        window.location.hash = '#/download';
    };
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-6 py-20 spatial-container", children: [_jsxs("div", { className: "text-center mb-24", children: [_jsx("h1", { className: "text-5xl font-display font-black mb-6 tracking-tighter uppercase glow-cyan", children: "Protocol Licensing" }), _jsx("p", { className: "text-white/40 text-sm tracking-[0.3em] uppercase", children: "One Payment. Absolute Sovereignty. Infinite Duration." })] }), hasLicense && licenseType === 'lifetime' ? (_jsxs("div", { className: "spatial-glass p-16 rounded-lg border-secondary/40 bg-gradient-to-br from-secondary/10 to-transparent relative text-center", children: [_jsx("div", { className: "w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8", children: _jsx("svg", { className: "w-10 h-10 text-secondary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }), _jsx("h2", { className: "text-3xl font-display font-black text-white mb-4", children: "LICENSE_ACTIVE" }), _jsx("p", { className: "text-white/60 font-mono text-sm mb-8", children: "Your lifetime license is verified and active." }), _jsx("button", { onClick: () => window.location.hash = '#/download', className: "px-12 py-4 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all", children: "DOWNLOAD_G3ZKP" })] })) : (_jsxs("div", { className: "spatial-glass p-16 rounded-lg border-primary/40 bg-gradient-to-br from-primary/10 to-transparent relative group", children: [_jsx("div", { className: "absolute top-0 right-0 p-6", children: _jsx("div", { className: "bg-secondary text-dark text-[10px] font-black px-4 py-1 skew-x-[-12deg] tracking-widest shadow-[0_0_15px_rgba(0,204,136,0.4)]", children: _jsx("span", { className: "block skew-x-[12deg]", children: "FULL_ACCESS_GEN_0" }) }) }), _jsxs("div", { className: "mb-12", children: [_jsx("div", { className: "text-8xl font-display font-black text-white mb-2 tracking-tighter drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]", children: "\u00A329.99" }), _jsx("p", { className: "text-primary font-black tracking-[0.4em] text-sm uppercase", children: "LIFETIME_ENCRYPTION_GRANT" })] }), _jsx("div", { className: "grid grid-cols-1 md:grid-cols-2 gap-8 mb-16", children: [
                            'P2P_PEER_STREAMS',
                            'ZERO_LOG_RETENTION',
                            'ZK_PROOF_VERIFIER',
                            'SECURE_FS_ENCRYPT',
                            'MULTI_NODE_SYNC',
                            'IMMUTABLE_DISTRO'
                        ].map((feature, i) => (_jsxs("div", { className: "flex items-center gap-4 text-white/70", children: [_jsx("svg", { className: "w-5 h-5 text-secondary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }), _jsx("span", { className: "font-display font-bold tracking-widest text-xs uppercase", children: feature })] }, i))) }), !isPaying ? (_jsx("button", { onClick: () => setIsPaying(true), className: "w-full py-6 bg-primary text-white font-black text-2xl rounded-none skew-x-[-8deg] hover:scale-[1.02] transition-all shadow-[0_0_40px_rgba(0,136,255,0.2)]", children: _jsx("span", { className: "block skew-x-[8deg]", children: "GENERATE_LICENSE" }) })) : (_jsx("div", { className: "animate-in fade-in zoom-in duration-500", children: _jsx(PaymentGateway, { amount: 29.99, onSuccess: handlePaymentSuccess, onCancel: () => setIsPaying(false) }) }))] })), _jsx("div", { className: "mt-16 flex flex-wrap justify-center gap-10 opacity-30", children: ['STRIPE', 'BITCOIN', 'SOLANA', 'ETHEREUM'].map(m => (_jsx("span", { className: "text-[10px] font-black tracking-[0.4em]", children: m }, m))) }), _jsx("div", { className: "mt-12 text-center", children: _jsx("p", { className: "text-[10px] text-white/20 font-mono uppercase tracking-widest", children: "ZKP Cryptographic License Verification \u2022 No Central Server \u2022 Privacy Preserved" }) })] }));
};
export default Pricing;
