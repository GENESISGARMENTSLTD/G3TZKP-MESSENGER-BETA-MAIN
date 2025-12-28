import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { LOGO } from '../constants';
const Home = () => {
    const [isSimulating, setIsSimulating] = useState(false);
    const [simStep, setSimStep] = useState(0);
    useEffect(() => {
        if (isSimulating) {
            const interval = setInterval(() => {
                setSimStep((prev) => (prev + 1) % 4);
            }, 1500);
            return () => clearInterval(interval);
        }
        else {
            setSimStep(0);
        }
    }, [isSimulating]);
    return (_jsxs("div", { className: "max-w-7xl mx-auto px-6 py-12 lg:py-24", children: [_jsxs("section", { className: "text-center mb-32 relative", children: [_jsx("div", { className: "flex justify-center mb-12", children: _jsx("div", { className: "w-32 h-32 md:w-48 md:h-48 transition-all duration-1000 hover:rotate-[360deg] hover:scale-110 cursor-pointer", children: LOGO("w-full h-full") }) }), _jsx("div", { className: "inline-block mb-6 px-4 py-1 border border-secondary/40 text-secondary text-[10px] font-mono font-bold tracking-[0.4em] uppercase", children: "COMMERCIAL_DEPLOYMENT_V1.0.0 // READY_FOR_UPLINK" }), _jsxs("h1", { className: "text-6xl lg:text-8xl font-display font-black mb-8 tracking-tighter leading-tight glow-cyan text-white", children: ["OWN YOUR ", _jsx("br", {}), _jsx("span", { className: "text-primary opacity-50", children: "[" }), "CONVERSATION", _jsx("span", { className: "text-primary opacity-50", children: "]" })] }), _jsx("p", { className: "text-sm font-mono text-white/40 mb-16 tracking-[0.4em] uppercase max-w-2xl mx-auto", children: "Universal P2P Encryption Engine. No Cloud. No Middlemen. Just pure mathematical sovereignty for Joe and Jane." }), _jsxs("div", { className: "flex flex-col sm:flex-row items-center justify-center gap-6", children: [_jsx(Link, { to: "/free-trial", className: "w-full sm:w-auto px-12 py-5 bg-primary text-dark font-black text-xs tracking-[0.3em] transition-all duration-150 transform hover:scale-[1.07] hover:brightness-125 active:scale-90 shadow-[0_0_30px_rgba(0,243,255,0.3)] hover:shadow-[0_0_60px_rgba(0,243,255,0.7)]", children: "ACTIVATE_GEN_KEY" }), _jsx(Link, { to: "/pricing", className: "w-full sm:w-auto px-12 py-5 border-2 border-primary/40 text-primary font-black text-xs tracking-[0.3em] transition-all duration-150 transform hover:scale-[1.07] hover:bg-primary/20 hover:border-primary active:scale-90 hover:shadow-[0_0_40px_rgba(0,243,255,0.4)]", children: "BUY_FULL_LICENSE" })] }), _jsxs("div", { className: "mt-32 max-w-5xl mx-auto relative", children: [_jsxs("div", { className: "absolute -top-10 left-10 text-[10px] font-mono text-primary/30 flex items-center gap-2", children: [_jsx("span", { className: `w-2 h-2 rounded-full ${isSimulating ? 'bg-secondary animate-ping' : 'bg-primary'}` }), "PEER_FINDER_SERVICE_", isSimulating ? 'ACTIVE' : 'IDLE', ": 127.0.0.1:443"] }), _jsxs("div", { className: "spatial-glass p-12 relative group overflow-hidden cursor-pointer", onClick: () => setIsSimulating(!isSimulating), children: [_jsx("div", { className: "absolute top-0 right-0 p-2 text-[8px] font-mono text-primary/20", children: isSimulating ? 'SIMULATING_X3DH_HANDSHAKE' : 'CLICK_TO_SIMULATE_TRANSFER' }), _jsxs("div", { className: "flex flex-col md:flex-row items-center justify-between gap-12", children: [_jsxs("div", { className: `text-center transition-all duration-500 ${simStep === 0 ? 'scale-110 glow-cyan' : 'opacity-40'}`, children: [_jsxs("div", { className: "w-16 h-16 border-2 border-primary/40 flex items-center justify-center mb-4 mx-auto relative", children: [simStep === 0 && _jsx("div", { className: "absolute inset-0 border border-primary animate-ping opacity-20" }), _jsx("span", { className: "text-primary font-mono text-xs font-black", children: "JOE" })] }), _jsx("p", { className: "font-mono text-[9px] text-white/30 tracking-widest uppercase", children: "Identity_Key_A" })] }), _jsxs("div", { className: "flex-1 flex flex-col items-center relative", children: [_jsx("div", { className: "w-full h-[1px] bg-gradient-to-r from-transparent via-primary/30 to-transparent" }), isSimulating && (_jsx("div", { className: `absolute top-[-4px] w-2 h-2 bg-secondary shadow-[0_0_10px_#00CC88] transition-all duration-1000 ease-in-out`, style: {
                                                            left: simStep === 1 ? '80%' : simStep === 3 ? '20%' : simStep === 0 ? '0%' : '100%',
                                                            opacity: (simStep === 1 || simStep === 3) ? 1 : 0
                                                        } })), _jsxs("div", { className: "mt-4 flex gap-8 text-[12px] font-mono text-secondary glow-green", children: [_jsx("span", { className: simStep === 1 ? 'animate-pulse' : '', children: simStep === 1 ? 'SENDING...' : '⊗_Φ_⊗' }), _jsx("span", { className: simStep === 2 ? 'animate-pulse' : '', children: simStep === 2 ? 'DECRYPTING' : '∘_∑_∘' }), _jsx("span", { className: simStep === 3 ? 'animate-pulse' : '', children: simStep === 3 ? 'RECEIVING' : '∇_Ψ_∇' })] })] }), _jsxs("div", { className: `text-center transition-all duration-500 ${simStep === 2 ? 'scale-110 glow-green' : 'opacity-40'}`, children: [_jsxs("div", { className: "w-16 h-16 border-2 border-secondary/40 flex items-center justify-center mb-4 mx-auto relative", children: [simStep === 2 && _jsx("div", { className: "absolute inset-0 border border-secondary animate-ping opacity-20" }), _jsx("span", { className: "text-secondary font-mono text-xs font-black", children: "JANE" })] }), _jsx("p", { className: "font-mono text-[9px] text-white/30 tracking-widest uppercase", children: "Identity_Key_B" })] })] })] })] })] }), _jsx("section", { className: "grid grid-cols-1 md:grid-cols-3 gap-8 mb-40", children: [
                    {
                        title: 'NATIVE_READY',
                        body: 'Commercial Release 1.0. Available for Windows (.exe), macOS (.dmg), Linux (.AppImage), and optimized PWA for iOS/Android.',
                        color: 'text-primary'
                    },
                    {
                        title: 'PRIVACY_SHIELD',
                        body: 'Zero-Knowledge anti-trafficking deterrents. We know the bad patterns, so we block them before they enter—all without reading your content.',
                        color: 'text-secondary'
                    },
                    {
                        title: 'SURE_TRANSFER',
                        body: 'Direct P2P delivery via libp2p. Sub-100ms latency for local connections. No central server ever touches your data packets.',
                        color: 'text-white'
                    }
                ].map((item, i) => (_jsxs("div", { className: "spatial-glass p-8 border-l-4 border-l-primary/40 relative hover:border-l-primary transition-all", children: [_jsxs("h3", { className: `text-xs font-mono font-black ${item.color} mb-4 tracking-widest uppercase`, children: ["STATUS::", item.title] }), _jsx("p", { className: "text-white/60 text-[11px] font-mono leading-relaxed", children: item.body }), _jsx("div", { className: "mt-6 text-[8px] font-mono text-white/20 uppercase", children: "SYSTEM_CHECK: STABLE" })] }, i))) }), _jsxs("section", { className: "max-w-3xl mx-auto border-t border-primary/10 pt-20", children: [_jsx("h2", { className: "text-2xl font-display font-black text-center mb-16 glow-cyan uppercase tracking-[0.2em]", children: "The Sovereign Manual" }), _jsx("div", { className: "space-y-16", children: [
                            { tag: '∀_x', label: 'UNIVERSAL_ANONYMITY', desc: '∀ users x, x_identity ∩ network_logs = ∅. We built a system where tracking you is mathematically impossible.' },
                            { tag: '∃_π', label: 'DETERRENT_LOGIC', desc: '∃ proof π for behavior patterns. We isolate harmful actors using decentralized consensus while keeping your messages 100% private.' },
                            { tag: '∇_c', label: 'IMMUTABLE_DISTRO', desc: '∇ · c = 0. Divergence-free distribution. Every binary is SHA-256 verified and delivered via IPFS for absolute integrity.' }
                        ].map((item, i) => (_jsxs("div", { className: "flex gap-10 group", children: [_jsx("div", { className: "text-3xl font-mono text-secondary opacity-40 group-hover:opacity-100 transition-opacity min-w-[80px]", children: item.tag }), _jsxs("div", { children: [_jsx("h4", { className: "font-mono font-bold text-sm tracking-widest text-white mb-2", children: item.label }), _jsx("p", { className: "text-white/40 text-xs font-mono", children: item.desc })] })] }, i))) })] })] }));
};
export default Home;
