
import React, { useState } from 'react';

interface PaymentFormProps {
  amount: number;
  onSuccess: () => void;
}

const PaymentForm: React.FC<PaymentFormProps> = ({ amount, onSuccess }) => {
  const [method, setMethod] = useState<'card' | 'crypto'>('card');
  const [loading, setLoading] = useState(false);

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Simulate API call to Stripe/Crypto processor
    setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 2000);
  };

  return (
    <div className="bg-white/5 p-8 rounded-2xl border border-white/10">
      <div className="flex gap-4 mb-8">
        <button
          onClick={() => setMethod('card')}
          className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
            method === 'card' ? 'bg-white text-dark border-white' : 'bg-transparent text-white border-white/20'
          }`}
        >
          Credit Card
        </button>
        <button
          onClick={() => setMethod('crypto')}
          className={`flex-1 py-3 rounded-xl font-bold border transition-all ${
            method === 'crypto' ? 'bg-white text-dark border-white' : 'bg-transparent text-white border-white/20'
          }`}
        >
          Crypto
        </button>
      </div>

      <form onSubmit={handlePayment} className="space-y-4">
        {method === 'card' ? (
          <>
            <div className="space-y-1">
              <label className="text-xs uppercase font-bold text-white/40">Card Number</label>
              <input type="text" placeholder="xxxx xxxx xxxx xxxx" className="w-full bg-dark/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary" required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/40">Expiry</label>
                <input type="text" placeholder="MM/YY" className="w-full bg-dark/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary" required />
              </div>
              <div className="space-y-1">
                <label className="text-xs uppercase font-bold text-white/40">CVC</label>
                <input type="text" placeholder="123" className="w-full bg-dark/50 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-primary" required />
              </div>
            </div>
          </>
        ) : (
          <div className="text-center p-6 bg-dark/50 rounded-xl border border-secondary/20">
            <p className="text-sm text-white/60 mb-4">You will be redirected to the secure crypto gateway to pay £{amount} in your preferred coin.</p>
            <div className="flex justify-center gap-3">
               <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center text-[10px] font-bold">BTC</div>
               <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-[10px] font-bold">ETH</div>
               <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center text-[10px] font-bold">SOL</div>
            </div>
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-secondary text-dark font-black rounded-xl hover:bg-secondary/90 transition-all disabled:opacity-50"
        >
          {loading ? 'Processing Payment...' : `Complete Order (£${amount})`}
        </button>
      </form>
      <p className="mt-4 text-[10px] text-center text-white/30 uppercase tracking-widest font-bold">Secure SSL Encrypted Transaction</p>
    </div>
  );
};

export default PaymentForm;
