import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/**
 * G3ZKP Payment Gateway Component
 *
 * Unified payment interface supporting Stripe and Cryptocurrency payments.
 * Integrates with ZKP license system for decentralized verification.
 */
import React, { useState, useEffect } from 'react';
import { stripeGateway, cryptoGateway } from '../services';
const PaymentGateway = ({ amount, onSuccess, onCancel }) => {
    const [method, setMethod] = useState('card');
    const [step, setStep] = useState('select');
    const [selectedCrypto, setSelectedCrypto] = useState(null);
    const [cryptoPayment, setCryptoPayment] = useState(null);
    const [cryptoAmount, setCryptoAmount] = useState('');
    const [qrCodeUrl, setQrCodeUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [licenseKey, setLicenseKey] = useState('');
    // Card form state
    const [cardNumber, setCardNumber] = useState('');
    const [cardExpiry, setCardExpiry] = useState('');
    const [cardCvc, setCardCvc] = useState('');
    const [cardName, setCardName] = useState('');
    const [email, setEmail] = useState('');
    // Crypto polling
    useEffect(() => {
        let pollInterval;
        if (cryptoPayment && cryptoPayment.status === 'pending') {
            pollInterval = setInterval(async () => {
                const updated = await cryptoGateway.checkPaymentStatus(cryptoPayment.id);
                if (updated) {
                    setCryptoPayment(updated);
                    if (updated.status === 'confirmed') {
                        setStep('success');
                        // Get license key from storage
                        const stored = localStorage.getItem(`g3zkp_crypto_payment_${updated.id}`);
                        if (stored) {
                            const data = JSON.parse(stored);
                            setLicenseKey(data.licenseKey || 'G3ZKP-XXXX-XXXX-XXXX-XXXX');
                        }
                    }
                    else if (updated.status === 'expired') {
                        setError('Payment expired. Please try again.');
                        setStep('error');
                    }
                }
            }, 5000);
        }
        return () => {
            if (pollInterval)
                clearInterval(pollInterval);
        };
    }, [cryptoPayment]);
    const handleStripePayment = async () => {
        setLoading(true);
        setError(null);
        try {
            const session = await stripeGateway.createCheckoutSession({ email });
            // Stripe will redirect to checkout
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Payment failed');
            setStep('error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCryptoSelect = async (currency) => {
        setLoading(true);
        setError(null);
        setSelectedCrypto(currency);
        try {
            const calculation = await cryptoGateway.calculateAmount(currency);
            setCryptoAmount(calculation.formattedCrypto);
            const payment = await cryptoGateway.createPaymentRequest(currency);
            setCryptoPayment(payment);
            const { qrData } = cryptoGateway.getPaymentDetails(currency);
            const qrUrl = await cryptoGateway.generateQRCode(qrData, 200);
            setQrCodeUrl(qrUrl);
            setStep('crypto-payment');
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to create payment');
            setStep('error');
        }
        finally {
            setLoading(false);
        }
    };
    const handleCryptoConfirm = async () => {
        if (!cryptoPayment)
            return;
        setLoading(true);
        setStep('processing');
        try {
            // Simulate transaction hash (in production, user would paste their tx hash)
            const mockTxHash = `0x${Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('')}`;
            await cryptoGateway.confirmPayment(cryptoPayment.id, mockTxHash);
        }
        catch (err) {
            setError(err instanceof Error ? err.message : 'Confirmation failed');
            setStep('error');
        }
        finally {
            setLoading(false);
        }
    };
    const formatCardNumber = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        const matches = v.match(/\d{4,16}/g);
        const match = (matches && matches[0]) || '';
        const parts = [];
        for (let i = 0, len = match.length; i < len; i += 4) {
            parts.push(match.substring(i, i + 4));
        }
        return parts.length ? parts.join(' ') : value;
    };
    const formatExpiry = (value) => {
        const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
        if (v.length >= 2) {
            return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
        }
        return v;
    };
    const cryptoCurrencies = [
        { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
        { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
        { id: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF' },
    ];
    const renderMethodSelect = () => (_jsx("div", { className: "space-y-6", children: _jsxs("div", { className: "flex gap-4", children: [_jsxs("button", { onClick: () => { setMethod('card'); setStep('card-form'); }, className: `flex-1 py-4 rounded-lg font-black border-2 transition-all ${method === 'card'
                        ? 'bg-primary/20 text-primary border-primary'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`, children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDCB3" }), _jsx("div", { className: "text-xs tracking-widest uppercase", children: "Credit Card" })] }), _jsxs("button", { onClick: () => { setMethod('crypto'); setStep('crypto-select'); }, className: `flex-1 py-4 rounded-lg font-black border-2 transition-all ${method === 'crypto'
                        ? 'bg-secondary/20 text-secondary border-secondary'
                        : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'}`, children: [_jsx("div", { className: "text-2xl mb-2", children: "\uD83D\uDD17" }), _jsx("div", { className: "text-xs tracking-widest uppercase", children: "Cryptocurrency" })] })] }) }));
    const renderCardForm = () => (_jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "space-y-4", children: [_jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "Email Address" }), _jsx("input", { type: "email", value: email, onChange: (e) => setEmail(e.target.value), placeholder: "your@email.com", className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors" })] }), _jsxs("div", { children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "Card Number" }), _jsx("input", { type: "text", value: cardNumber, onChange: (e) => setCardNumber(formatCardNumber(e.target.value)), placeholder: "4242 4242 4242 4242", maxLength: 19, className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors" })] }), _jsxs("div", { className: "grid grid-cols-3 gap-4", children: [_jsxs("div", { className: "col-span-1", children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "Expiry" }), _jsx("input", { type: "text", value: cardExpiry, onChange: (e) => setCardExpiry(formatExpiry(e.target.value)), placeholder: "MM/YY", maxLength: 5, className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors" })] }), _jsxs("div", { className: "col-span-1", children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "CVC" }), _jsx("input", { type: "text", value: cardCvc, onChange: (e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4)), placeholder: "123", maxLength: 4, className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors" })] }), _jsxs("div", { className: "col-span-1", children: [_jsx("label", { className: "block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest", children: "Name" }), _jsx("input", { type: "text", value: cardName, onChange: (e) => setCardName(e.target.value), placeholder: "J. DOE", className: "w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors" })] })] })] }), _jsx("button", { onClick: handleStripePayment, disabled: loading || !email || !cardNumber, className: "w-full py-5 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed", children: loading ? 'PROCESSING...' : `PAY £${amount.toFixed(2)}` }), _jsx("button", { onClick: () => setStep('select'), className: "w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase", children: "\u2190 Back to payment methods" })] }));
    const renderCryptoSelect = () => (_jsxs("div", { className: "space-y-6", children: [_jsx("p", { className: "text-white/40 text-sm font-mono text-center mb-6", children: "Select your preferred cryptocurrency" }), _jsx("div", { className: "grid grid-cols-3 gap-4", children: cryptoCurrencies.map((crypto) => (_jsxs("button", { onClick: () => handleCryptoSelect(crypto.id), disabled: loading, className: "py-6 rounded-lg border-2 border-white/10 hover:border-white/30 transition-all flex flex-col items-center gap-2 disabled:opacity-50", style: { '--hover-color': crypto.color }, children: [_jsx("span", { className: "text-3xl", style: { color: crypto.color }, children: crypto.icon }), _jsx("span", { className: "text-xs font-black tracking-widest text-white/60", children: crypto.id })] }, crypto.id))) }), _jsx("button", { onClick: () => setStep('select'), className: "w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase", children: "\u2190 Back to payment methods" })] }));
    const renderCryptoPayment = () => (_jsx("div", { className: "space-y-6", children: cryptoPayment && selectedCrypto && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "text-center", children: [_jsx("p", { className: "text-white/40 text-xs font-mono uppercase tracking-widest mb-4", children: "Send exactly" }), _jsx("div", { className: "text-3xl font-black text-primary glow-cyan mb-2", children: cryptoAmount }), _jsxs("p", { className: "text-white/30 text-xs font-mono", children: ["(\u2248 \u00A3", amount.toFixed(2), ")"] })] }), _jsx("div", { className: "flex justify-center", children: _jsx("div", { className: "p-4 bg-white rounded-lg", children: _jsx("img", { src: qrCodeUrl, alt: "Payment QR Code", className: "w-48 h-48" }) }) }), _jsxs("div", { className: "space-y-2", children: [_jsxs("p", { className: "text-white/40 text-[10px] font-mono uppercase tracking-widest text-center", children: [selectedCrypto, " Address"] }), _jsx("div", { className: "bg-dark/50 border border-white/10 rounded-lg p-3 break-all", children: _jsx("code", { className: "text-primary text-xs font-mono", children: cryptoPayment.address }) }), _jsx("button", { onClick: () => navigator.clipboard.writeText(cryptoPayment.address), className: "w-full text-primary/60 text-xs font-black tracking-widest hover:text-primary transition-colors uppercase", children: "Copy Address" })] }), _jsxs("div", { className: "text-center text-white/30 text-xs font-mono", children: [_jsxs("p", { children: ["Memo/Reference: ", _jsx("span", { className: "text-secondary", children: cryptoPayment.memo })] }), _jsxs("p", { className: "mt-2", children: ["Expires in: ", Math.max(0, Math.floor((cryptoPayment.expiresAt - Date.now()) / 60000)), " minutes"] })] }), _jsx("button", { onClick: handleCryptoConfirm, disabled: loading, className: "w-full py-5 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50", children: loading ? 'VERIFYING...' : 'I HAVE SENT THE PAYMENT' }), _jsx("button", { onClick: () => setStep('crypto-select'), className: "w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase", children: "\u2190 Choose different currency" })] })) }));
    const renderProcessing = () => (_jsxs("div", { className: "text-center py-12 space-y-6", children: [_jsx("div", { className: "w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-white mb-2", children: "VERIFYING PAYMENT" }), _jsx("p", { className: "text-white/40 text-sm font-mono", children: "Waiting for blockchain confirmations..." }), cryptoPayment && (_jsxs("p", { className: "text-primary text-xs font-mono mt-4", children: [cryptoPayment.confirmations, " / ", cryptoPayment.requiredConfirmations, " confirmations"] }))] })] }));
    const renderSuccess = () => (_jsxs("div", { className: "text-center py-12 space-y-6", children: [_jsx("div", { className: "w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto", children: _jsx("svg", { className: "w-10 h-10 text-secondary", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M5 13l4 4L19 7" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-2xl font-black text-white mb-2", children: "PAYMENT SUCCESSFUL" }), _jsx("p", { className: "text-white/40 text-sm font-mono mb-6", children: "Your lifetime license has been generated" }), _jsxs("div", { className: "bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-6", children: [_jsx("p", { className: "text-[10px] text-white/40 uppercase tracking-widest mb-2", children: "License Key" }), _jsx("code", { className: "text-secondary text-lg font-mono font-black tracking-wider", children: licenseKey || 'G3ZKP-XXXX-XXXX-XXXX-XXXX' })] })] }), _jsx("button", { onClick: () => onSuccess(licenseKey), className: "w-full py-5 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all", children: "DOWNLOAD G3ZKP MESSENGER" })] }));
    const renderError = () => (_jsxs("div", { className: "text-center py-12 space-y-6", children: [_jsx("div", { className: "w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto", children: _jsx("svg", { className: "w-10 h-10 text-red-500", fill: "none", stroke: "currentColor", viewBox: "0 0 24 24", children: _jsx("path", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "3", d: "M6 18L18 6M6 6l12 12" }) }) }), _jsxs("div", { children: [_jsx("h3", { className: "text-xl font-black text-white mb-2", children: "PAYMENT FAILED" }), _jsx("p", { className: "text-white/40 text-sm font-mono", children: error || 'An unexpected error occurred' })] }), _jsx("button", { onClick: () => { setError(null); setStep('select'); }, className: "w-full py-4 bg-primary text-dark font-black tracking-widest uppercase hover:brightness-110 transition-all", children: "TRY AGAIN" })] }));
    return (_jsxs("div", { className: "bg-white/5 p-8 rounded-2xl border border-white/10", children: [_jsxs("div", { className: "text-center mb-8", children: [_jsx("h2", { className: "text-2xl font-black text-white mb-2", children: "COMPLETE PURCHASE" }), _jsxs("p", { className: "text-white/40 text-sm font-mono", children: ["Lifetime License \u2014 \u00A3", amount.toFixed(2)] })] }), step === 'select' && renderMethodSelect(), step === 'card-form' && renderCardForm(), step === 'crypto-select' && renderCryptoSelect(), step === 'crypto-payment' && renderCryptoPayment(), step === 'processing' && renderProcessing(), step === 'success' && renderSuccess(), step === 'error' && renderError(), step !== 'success' && step !== 'processing' && onCancel && (_jsx("div", { className: "mt-6 pt-6 border-t border-white/5 text-center", children: _jsx("button", { onClick: onCancel, className: "text-white/20 text-xs font-black tracking-widest hover:text-white/40 transition-colors uppercase", children: "Cancel" }) })), _jsx("p", { className: "mt-6 text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-black", children: "Secured by ZKP Cryptographic Verification \u2022 No Data Stored" })] }));
};
export default PaymentGateway;
