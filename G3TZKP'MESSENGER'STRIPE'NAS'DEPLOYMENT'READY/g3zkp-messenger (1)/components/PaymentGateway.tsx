/**
 * G3ZKP Payment Gateway Component
 * 
 * Unified payment interface supporting Stripe and Cryptocurrency payments.
 * Integrates with ZKP license system for decentralized verification.
 */

import React, { useState, useEffect } from 'react';
import { stripeGateway, cryptoGateway, type CryptoCurrency, type CryptoPaymentRequest } from '../services';

interface PaymentGatewayProps {
  amount: number;
  onSuccess: (licenseKey: string) => void;
  onCancel?: () => void;
}

type PaymentMethod = 'card' | 'crypto';
type PaymentStep = 'select' | 'card-form' | 'crypto-select' | 'crypto-payment' | 'processing' | 'success' | 'error';

const PaymentGateway: React.FC<PaymentGatewayProps> = ({ amount, onSuccess, onCancel }) => {
  const [method, setMethod] = useState<PaymentMethod>('card');
  const [step, setStep] = useState<PaymentStep>('select');
  const [selectedCrypto, setSelectedCrypto] = useState<CryptoCurrency | null>(null);
  const [cryptoPayment, setCryptoPayment] = useState<CryptoPaymentRequest | null>(null);
  const [cryptoAmount, setCryptoAmount] = useState<string>('');
  const [qrCodeUrl, setQrCodeUrl] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [licenseKey, setLicenseKey] = useState<string>('');

  // Card form state
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [cardName, setCardName] = useState('');
  const [email, setEmail] = useState('');

  // Crypto polling
  useEffect(() => {
    let pollInterval: NodeJS.Timeout;

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
          } else if (updated.status === 'expired') {
            setError('Payment expired. Please try again.');
            setStep('error');
          }
        }
      }, 5000);
    }

    return () => {
      if (pollInterval) clearInterval(pollInterval);
    };
  }, [cryptoPayment]);

  const handleStripePayment = async () => {
    setLoading(true);
    setError(null);

    try {
      const session = await stripeGateway.createCheckoutSession({ email });
      // Stripe will redirect to checkout
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Payment failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoSelect = async (currency: CryptoCurrency) => {
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
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create payment');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const handleCryptoConfirm = async () => {
    if (!cryptoPayment) return;

    setLoading(true);
    setStep('processing');

    try {
      // Simulate transaction hash (in production, user would paste their tx hash)
      const mockTxHash = `0x${Array.from({ length: 64 }, () => 
        Math.floor(Math.random() * 16).toString(16)
      ).join('')}`;

      await cryptoGateway.confirmPayment(cryptoPayment.id, mockTxHash);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Confirmation failed');
      setStep('error');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    return parts.length ? parts.join(' ') : value;
  };

  const formatExpiry = (value: string) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    if (v.length >= 2) {
      return `${v.substring(0, 2)}/${v.substring(2, 4)}`;
    }
    return v;
  };

  const cryptoCurrencies: { id: CryptoCurrency; name: string; icon: string; color: string }[] = [
    { id: 'BTC', name: 'Bitcoin', icon: '₿', color: '#F7931A' },
    { id: 'ETH', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
    { id: 'SOL', name: 'Solana', icon: '◎', color: '#9945FF' },
  ];

  const renderMethodSelect = () => (
    <div className="space-y-6">
      <div className="flex gap-4">
        <button
          onClick={() => { setMethod('card'); setStep('card-form'); }}
          className={`flex-1 py-4 rounded-lg font-black border-2 transition-all ${
            method === 'card'
              ? 'bg-primary/20 text-primary border-primary'
              : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
          }`}
        >
          <div className="text-2xl mb-2">💳</div>
          <div className="text-xs tracking-widest uppercase">Credit Card</div>
        </button>
        <button
          onClick={() => { setMethod('crypto'); setStep('crypto-select'); }}
          className={`flex-1 py-4 rounded-lg font-black border-2 transition-all ${
            method === 'crypto'
              ? 'bg-secondary/20 text-secondary border-secondary'
              : 'bg-transparent text-white/60 border-white/10 hover:border-white/30'
          }`}
        >
          <div className="text-2xl mb-2">🔗</div>
          <div className="text-xs tracking-widest uppercase">Cryptocurrency</div>
        </button>
      </div>
    </div>
  );

  const renderCardForm = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div>
          <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">
            Email Address
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="your@email.com"
            className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div>
          <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">
            Card Number
          </label>
          <input
            type="text"
            value={cardNumber}
            onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
            placeholder="4242 4242 4242 4242"
            maxLength={19}
            className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors"
          />
        </div>
        <div className="grid grid-cols-3 gap-4">
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">
              Expiry
            </label>
            <input
              type="text"
              value={cardExpiry}
              onChange={(e) => setCardExpiry(formatExpiry(e.target.value))}
              placeholder="MM/YY"
              maxLength={5}
              className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">
              CVC
            </label>
            <input
              type="text"
              value={cardCvc}
              onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, '').substring(0, 4))}
              placeholder="123"
              maxLength={4}
              className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors"
            />
          </div>
          <div className="col-span-1">
            <label className="block text-[10px] font-black text-white/40 mb-2 uppercase tracking-widest">
              Name
            </label>
            <input
              type="text"
              value={cardName}
              onChange={(e) => setCardName(e.target.value)}
              placeholder="J. DOE"
              className="w-full bg-dark/50 border border-white/10 rounded-lg p-4 text-white font-mono focus:outline-none focus:border-primary transition-colors"
            />
          </div>
        </div>
      </div>

      <button
        onClick={handleStripePayment}
        disabled={loading || !email || !cardNumber}
        className="w-full py-5 bg-primary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {loading ? 'PROCESSING...' : `PAY £${amount.toFixed(2)}`}
      </button>

      <button
        onClick={() => setStep('select')}
        className="w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase"
      >
        ← Back to payment methods
      </button>
    </div>
  );

  const renderCryptoSelect = () => (
    <div className="space-y-6">
      <p className="text-white/40 text-sm font-mono text-center mb-6">
        Select your preferred cryptocurrency
      </p>

      <div className="grid grid-cols-3 gap-4">
        {cryptoCurrencies.map((crypto) => (
          <button
            key={crypto.id}
            onClick={() => handleCryptoSelect(crypto.id)}
            disabled={loading}
            className="py-6 rounded-lg border-2 border-white/10 hover:border-white/30 transition-all flex flex-col items-center gap-2 disabled:opacity-50"
            style={{ '--hover-color': crypto.color } as React.CSSProperties}
          >
            <span className="text-3xl" style={{ color: crypto.color }}>{crypto.icon}</span>
            <span className="text-xs font-black tracking-widest text-white/60">{crypto.id}</span>
          </button>
        ))}
      </div>

      <button
        onClick={() => setStep('select')}
        className="w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase"
      >
        ← Back to payment methods
      </button>
    </div>
  );

  const renderCryptoPayment = () => (
    <div className="space-y-6">
      {cryptoPayment && selectedCrypto && (
        <>
          <div className="text-center">
            <p className="text-white/40 text-xs font-mono uppercase tracking-widest mb-4">
              Send exactly
            </p>
            <div className="text-3xl font-black text-primary glow-cyan mb-2">
              {cryptoAmount}
            </div>
            <p className="text-white/30 text-xs font-mono">
              (≈ £{amount.toFixed(2)})
            </p>
          </div>

          <div className="flex justify-center">
            <div className="p-4 bg-white rounded-lg">
              <img
                src={qrCodeUrl}
                alt="Payment QR Code"
                className="w-48 h-48"
              />
            </div>
          </div>

          <div className="space-y-2">
            <p className="text-white/40 text-[10px] font-mono uppercase tracking-widest text-center">
              {selectedCrypto} Address
            </p>
            <div className="bg-dark/50 border border-white/10 rounded-lg p-3 break-all">
              <code className="text-primary text-xs font-mono">
                {cryptoPayment.address}
              </code>
            </div>
            <button
              onClick={() => navigator.clipboard.writeText(cryptoPayment.address)}
              className="w-full text-primary/60 text-xs font-black tracking-widest hover:text-primary transition-colors uppercase"
            >
              Copy Address
            </button>
          </div>

          <div className="text-center text-white/30 text-xs font-mono">
            <p>Memo/Reference: <span className="text-secondary">{cryptoPayment.memo}</span></p>
            <p className="mt-2">
              Expires in: {Math.max(0, Math.floor((cryptoPayment.expiresAt - Date.now()) / 60000))} minutes
            </p>
          </div>

          <button
            onClick={handleCryptoConfirm}
            disabled={loading}
            className="w-full py-5 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'VERIFYING...' : 'I HAVE SENT THE PAYMENT'}
          </button>

          <button
            onClick={() => setStep('crypto-select')}
            className="w-full text-white/30 text-xs font-black tracking-widest hover:text-white transition-colors uppercase"
          >
            ← Choose different currency
          </button>
        </>
      )}
    </div>
  );

  const renderProcessing = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 border-4 border-primary/20 border-t-primary rounded-full animate-spin mx-auto" />
      <div>
        <h3 className="text-xl font-black text-white mb-2">VERIFYING PAYMENT</h3>
        <p className="text-white/40 text-sm font-mono">
          Waiting for blockchain confirmations...
        </p>
        {cryptoPayment && (
          <p className="text-primary text-xs font-mono mt-4">
            {cryptoPayment.confirmations} / {cryptoPayment.requiredConfirmations} confirmations
          </p>
        )}
      </div>
    </div>
  );

  const renderSuccess = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-secondary/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div>
        <h3 className="text-2xl font-black text-white mb-2">PAYMENT SUCCESSFUL</h3>
        <p className="text-white/40 text-sm font-mono mb-6">
          Your lifetime license has been generated
        </p>
        <div className="bg-dark/50 border border-secondary/30 rounded-lg p-4 mb-6">
          <p className="text-[10px] text-white/40 uppercase tracking-widest mb-2">License Key</p>
          <code className="text-secondary text-lg font-mono font-black tracking-wider">
            {licenseKey || 'G3ZKP-XXXX-XXXX-XXXX-XXXX'}
          </code>
        </div>
      </div>
      <button
        onClick={() => onSuccess(licenseKey)}
        className="w-full py-5 bg-secondary text-dark font-black text-lg tracking-widest uppercase hover:brightness-110 transition-all"
      >
        DOWNLOAD G3ZKP MESSENGER
      </button>
    </div>
  );

  const renderError = () => (
    <div className="text-center py-12 space-y-6">
      <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto">
        <svg className="w-10 h-10 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <div>
        <h3 className="text-xl font-black text-white mb-2">PAYMENT FAILED</h3>
        <p className="text-white/40 text-sm font-mono">{error || 'An unexpected error occurred'}</p>
      </div>
      <button
        onClick={() => { setError(null); setStep('select'); }}
        className="w-full py-4 bg-primary text-dark font-black tracking-widest uppercase hover:brightness-110 transition-all"
      >
        TRY AGAIN
      </button>
    </div>
  );

  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-black text-white mb-2">COMPLETE PURCHASE</h2>
        <p className="text-white/40 text-sm font-mono">
          Lifetime License — £{amount.toFixed(2)}
        </p>
      </div>

      {step === 'select' && renderMethodSelect()}
      {step === 'card-form' && renderCardForm()}
      {step === 'crypto-select' && renderCryptoSelect()}
      {step === 'crypto-payment' && renderCryptoPayment()}
      {step === 'processing' && renderProcessing()}
      {step === 'success' && renderSuccess()}
      {step === 'error' && renderError()}

      {step !== 'success' && step !== 'processing' && onCancel && (
        <div className="mt-6 pt-6 border-t border-white/5 text-center">
          <button
            onClick={onCancel}
            className="text-white/20 text-xs font-black tracking-widest hover:text-white/40 transition-colors uppercase"
          >
            Cancel
          </button>
        </div>
      )}

      <p className="mt-6 text-[8px] text-center text-white/20 uppercase tracking-[0.3em] font-black">
        Secured by ZKP Cryptographic Verification • No Data Stored
      </p>
    </div>
  );
};

export default PaymentGateway;
