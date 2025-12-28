import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { licenseManager } from '../services';
const FreeTrial = () => {
    const [email, setEmail] = useState('');
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(false);
    const [licenseKey, setLicenseKey] = useState('');
    const [timeLeft, setTimeLeft] = useState(604800); // 7 days in seconds
    const [hasExistingLicense, setHasExistingLicense] = useState(false);
    const [existingLicenseType, setExistingLicenseType] = useState(null);
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
    const formatTime = (seconds) => {
        const d = Math.floor(seconds / (3600 * 24));
        const h = Math.floor((seconds % (3600 * 24)) / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${d}d ${h}h ${m}m ${s}s`;
    };
    const handleSignup = async (e) => {
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
        }
        catch (error) {
            console.error('Failed to create trial license:', error);
        }
        finally {
            setLoading(false);
        }
    };
    // Show existing license status
    if (hasExistingLicense) {
        return (_jsxs("div", { className: "max-w-2xl mx-auto px-6 py-20 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8", children: _jsx("svg", { className: "w-10 h-10 text-secondary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }), _jsx("h1", { className: "text-4xl font-display font-black mb-4 uppercase tracking-tighter glow-cyan", children: existingLicenseType === 'lifetime' ? 'LIFETIME_LICENSE_ACTIVE' : 'TRIAL_ACTIVE' }), _jsx("p", { className: "text-xl text-white/60 mb-6 font-mono", children: existingLicenseType === 'lifetime'
                        ? 'Your lifetime license is verified and active.'
                        : 'Your 7-day trial is active. Full features unlocked.' }), licenseKey && (_jsxs("div", { className: "bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-8 inline-block", children: [_jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest mb-2", children: "License Key" }), _jsx("code", { className: "text-secondary text-lg font-mono font-black tracking-wider", children: licenseKey })] })), _jsxs("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: [_jsx(Link, { to: "/download", className: "px-10 py-4 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all", children: "DOWNLOAD_NOW" }), existingLicenseType === 'trial' && (_jsx(Link, { to: "/pricing", className: "px-10 py-4 border-2 border-secondary text-secondary font-black text-lg tracking-widest uppercase hover:bg-secondary hover:text-dark transition-all", children: "UPGRADE_TO_LIFETIME" }))] })] }));
    }
    if (success) {
        return (_jsxs("div", { className: "max-w-2xl mx-auto px-6 py-20 text-center", children: [_jsx("div", { className: "w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-8", children: _jsx("svg", { className: "w-10 h-10 text-secondary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }), _jsx("h1", { className: "text-4xl font-display font-black mb-4 uppercase tracking-tighter glow-cyan", children: "TRIAL_ACTIVATED" }), _jsx("p", { className: "text-xl text-white/60 mb-6 font-mono", children: "No credit card required. Your 7-day privacy shield is ready." }), licenseKey && (_jsxs("div", { className: "bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-8 inline-block", children: [_jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest mb-2", children: "Your License Key" }), _jsx("code", { className: "text-secondary text-lg font-mono font-black tracking-wider", children: licenseKey })] })), _jsx("div", { className: "flex flex-col sm:flex-row gap-4 justify-center", children: _jsx(Link, { to: "/download", className: "px-10 py-4 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all", children: "DOWNLOAD_G3ZKP" }) }), _jsx("p", { className: "mt-8 text-white/30 text-xs font-mono", children: "License stored locally with ZKP cryptographic verification" })] }));
    }
    return (_jsxs("div", { className: "max-w-4xl mx-auto px-6 py-20", children: [_jsxs("div", { className: "grid grid-cols-1 lg:grid-cols-2 gap-16 items-center", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-5xl font-display font-black mb-6 uppercase tracking-tighter glow-cyan", children: "7-Day Free Trial" }), _jsx("p", { className: "text-xl text-white/60 mb-8 font-mono", children: "Experience absolute digital sovereignty for one week. No strings attached." }), _jsx("ul", { className: "space-y-4 mb-12", children: [
                                    'All features unlocked',
                                    'Unlimited messages',
                                    'Unlimited files (up to 1GB)',
                                    'Group chats (100+ people)',
                                    'Encrypted voice/video calls'
                                ].map((item, i) => (_jsxs("li", { className: "flex items-center gap-3 text-secondary font-mono text-sm", children: [_jsx("svg", { className: "w-5 h-5", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "2", d: "M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" }) }), item] }, i))) }), _jsxs("div", { className: "spatial-glass p-6 rounded-lg border-secondary/20", children: [_jsx("p", { className: "text-[10px] font-black uppercase tracking-widest text-secondary mb-2", children: "TRIAL_COUNTDOWN" }), _jsx("div", { className: "text-3xl font-mono font-black text-white", children: formatTime(timeLeft) })] })] }), _jsxs("div", { className: "spatial-glass p-10 rounded-lg border-white/10", children: [_jsxs("form", { onSubmit: handleSignup, className: "space-y-6", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "Email Address (Optional)" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-secondary transition-colors", placeholder: "you@example.com" })] }), _jsx("p", { className: "text-[10px] text-white/40 font-mono", children: "Your license is generated and stored locally using ZKP cryptographic verification. No data is sent to any server." }), _jsx("button", { type: "submit", disabled: loading, className: "w-full py-5 bg-secondary text-dark font-black text-xl tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50", children: loading ? 'GENERATING...' : 'ACTIVATE_TRIAL' })] }), _jsx("div", { className: "mt-8 text-center", children: _jsx(Link, { to: "/pricing", className: "text-sm text-primary hover:glow-cyan font-mono font-black tracking-widest uppercase", children: "Or buy lifetime license for \u00A329.99" }) })] })] }), _jsx("div", { className: "mt-16 text-center", children: _jsx("p", { className: "text-[10px] text-white/20 font-mono uppercase tracking-widest", children: "ZKP Decentralized License \u2022 No Central Server \u2022 Privacy Preserved" }) })] }));
};
export default FreeTrial;
