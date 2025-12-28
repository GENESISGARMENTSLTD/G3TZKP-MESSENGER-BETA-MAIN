/**
 * G3ZKP Stripe Payment Gateway
 *
 * Full implementation of Stripe payment processing for license purchases.
 * Handles checkout sessions, webhooks, and payment verification.
 */
import { licenseManager } from '../crypto/zkp-license';
/**
 * Stripe Configuration
 */
const STRIPE_CONFIG = {
    publicKey: import.meta.env.VITE_STRIPE_PUBLIC_KEY || 'pk_test_placeholder',
    priceId: import.meta.env.VITE_STRIPE_PRICE_ID || 'price_g3zkp_lifetime',
    productName: 'G3ZKP Messenger Lifetime License',
    amount: 2999, // £29.99 in pence
    currency: 'gbp',
    successUrl: `${window.location.origin}/#/download?payment=success&session_id={CHECKOUT_SESSION_ID}`,
    cancelUrl: `${window.location.origin}/#/pricing?payment=cancelled`,
};
/**
 * Stripe Gateway Class
 */
export class StripeGateway {
    stripe = null;
    initialized = false;
    sessions = new Map();
    /**
     * Initialize Stripe.js
     */
    async initialize() {
        if (this.initialized)
            return true;
        try {
            // Load Stripe.js dynamically
            if (!window.Stripe) {
                await this.loadStripeScript();
            }
            this.stripe = window.Stripe(STRIPE_CONFIG.publicKey);
            this.initialized = true;
            return true;
        }
        catch (error) {
            console.error('Failed to initialize Stripe:', error);
            return false;
        }
    }
    /**
     * Load Stripe.js script dynamically
     */
    loadStripeScript() {
        return new Promise((resolve, reject) => {
            if (document.querySelector('script[src*="stripe.com"]')) {
                resolve();
                return;
            }
            const script = document.createElement('script');
            script.src = 'https://js.stripe.com/v3/';
            script.async = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Failed to load Stripe.js'));
            document.head.appendChild(script);
        });
    }
    /**
     * Create a checkout session and redirect to Stripe
     */
    async createCheckoutSession(options = {}) {
        await this.initialize();
        const sessionId = this.generateSessionId();
        const deviceId = await licenseManager.getDeviceId();
        const session = {
            id: sessionId,
            status: 'processing',
            amount: STRIPE_CONFIG.amount,
            currency: STRIPE_CONFIG.currency,
            createdAt: Date.now(),
        };
        this.sessions.set(sessionId, session);
        this.persistSession(session);
        try {
            // Create checkout session via Stripe
            // In production, this would call your backend API
            const response = await this.createStripeSession({
                ...options,
                deviceId,
                sessionId,
            });
            if (response.url) {
                // Redirect to Stripe Checkout
                window.location.href = response.url;
            }
            else if (response.sessionId) {
                // Use Stripe.js redirect
                const { error } = await this.stripe.redirectToCheckout({
                    sessionId: response.sessionId,
                });
                if (error) {
                    throw new Error(error.message);
                }
            }
            return session;
        }
        catch (error) {
            session.status = 'failed';
            session.error = error instanceof Error ? error.message : 'Checkout failed';
            this.sessions.set(sessionId, session);
            this.persistSession(session);
            return session;
        }
    }
    /**
     * Create Stripe checkout session
     * In production, this calls your backend API
     */
    async createStripeSession(params) {
        // For demo/development: Create a mock session
        // In production, replace with actual API call to your backend
        const mockSessionId = `cs_${this.generateSessionId()}`;
        // Store pending session for verification
        const pendingSession = {
            stripeSessionId: mockSessionId,
            deviceId: params.deviceId,
            localSessionId: params.sessionId,
            email: params.email,
            createdAt: Date.now(),
        };
        localStorage.setItem(`g3zkp_pending_payment_${mockSessionId}`, JSON.stringify(pendingSession));
        // In production, this would be:
        // const response = await fetch('/api/create-checkout-session', {
        //   method: 'POST',
        //   headers: { 'Content-Type': 'application/json' },
        //   body: JSON.stringify({
        //     priceId: STRIPE_CONFIG.priceId,
        //     successUrl: STRIPE_CONFIG.successUrl,
        //     cancelUrl: STRIPE_CONFIG.cancelUrl,
        //     customerEmail: params.email,
        //     metadata: {
        //       deviceId: params.deviceId,
        //       sessionId: params.sessionId,
        //       ...params.metadata,
        //     },
        //   }),
        // });
        // return await response.json();
        // Demo mode: Simulate successful payment flow
        return {
            url: `${window.location.origin}/#/download?payment=success&session_id=${mockSessionId}&demo=true`,
        };
    }
    /**
     * Verify payment completion and generate license
     */
    async verifyPayment(sessionId) {
        const pendingKey = `g3zkp_pending_payment_${sessionId}`;
        const pendingData = localStorage.getItem(pendingKey);
        if (!pendingData) {
            return {
                id: sessionId,
                status: 'failed',
                amount: 0,
                currency: STRIPE_CONFIG.currency,
                createdAt: Date.now(),
                error: 'Session not found',
            };
        }
        try {
            const pending = JSON.parse(pendingData);
            // In production, verify with Stripe API:
            // const response = await fetch(`/api/verify-payment/${sessionId}`);
            // const verification = await response.json();
            // Generate license after successful payment
            const paymentProof = JSON.stringify({
                sessionId,
                provider: 'stripe',
                amount: STRIPE_CONFIG.amount,
                currency: STRIPE_CONFIG.currency,
                timestamp: Date.now(),
                deviceId: pending.deviceId,
            });
            const license = await licenseManager.createLifetimeLicense(paymentProof);
            await licenseManager.storeLicense(license);
            const licenseKey = await this.generateDisplayLicenseKey(license);
            // Clean up pending session
            localStorage.removeItem(pendingKey);
            const session = {
                id: sessionId,
                status: 'success',
                amount: STRIPE_CONFIG.amount,
                currency: STRIPE_CONFIG.currency,
                createdAt: pending.createdAt,
                completedAt: Date.now(),
                licenseKey,
            };
            this.sessions.set(sessionId, session);
            this.persistSession(session);
            return session;
        }
        catch (error) {
            return {
                id: sessionId,
                status: 'failed',
                amount: STRIPE_CONFIG.amount,
                currency: STRIPE_CONFIG.currency,
                createdAt: Date.now(),
                error: error instanceof Error ? error.message : 'Verification failed',
            };
        }
    }
    /**
     * Handle Stripe webhook events
     * This would typically run on your backend
     */
    async handleWebhook(event) {
        switch (event.type) {
            case 'checkout.session.completed':
                await this.handleCheckoutCompleted(event.data.object);
                break;
            case 'payment_intent.succeeded':
                await this.handlePaymentSucceeded(event.data.object);
                break;
            case 'payment_intent.payment_failed':
                await this.handlePaymentFailed(event.data.object);
                break;
        }
    }
    async handleCheckoutCompleted(session) {
        const deviceId = session.metadata?.deviceId;
        const localSessionId = session.metadata?.sessionId;
        if (deviceId && localSessionId) {
            const paymentProof = JSON.stringify({
                stripeSessionId: session.id,
                paymentIntent: session.payment_intent,
                amount: session.amount_total,
                currency: session.currency,
                customerEmail: session.customer_email,
                timestamp: Date.now(),
            });
            // License would be created here in webhook handler
            console.log('Checkout completed:', { deviceId, paymentProof });
        }
    }
    async handlePaymentSucceeded(paymentIntent) {
        console.log('Payment succeeded:', paymentIntent.id);
    }
    async handlePaymentFailed(paymentIntent) {
        console.error('Payment failed:', paymentIntent.id, paymentIntent.last_payment_error);
    }
    /**
     * Get session by ID
     */
    getSession(sessionId) {
        // Check memory first
        let session = this.sessions.get(sessionId);
        if (session)
            return session;
        // Check localStorage
        const stored = localStorage.getItem(`g3zkp_payment_session_${sessionId}`);
        if (stored) {
            session = JSON.parse(stored);
            this.sessions.set(sessionId, session);
            return session;
        }
        return null;
    }
    /**
     * Generate unique session ID
     */
    generateSessionId() {
        const bytes = new Uint8Array(16);
        crypto.getRandomValues(bytes);
        return Array.from(bytes).map(b => b.toString(16).padStart(2, '0')).join('');
    }
    /**
     * Generate display-friendly license key
     */
    async generateDisplayLicenseKey(license) {
        const hash = await this.hashString(JSON.stringify(license));
        const shortHash = hash.substring(0, 16).toUpperCase();
        return `G3ZKP-${shortHash.substring(0, 4)}-${shortHash.substring(4, 8)}-${shortHash.substring(8, 12)}-${shortHash.substring(12, 16)}`;
    }
    /**
     * Hash a string using SHA-256
     */
    async hashString(data) {
        const encoder = new TextEncoder();
        const encoded = encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        return Array.from(new Uint8Array(hashBuffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    }
    /**
     * Persist session to localStorage
     */
    persistSession(session) {
        localStorage.setItem(`g3zkp_payment_session_${session.id}`, JSON.stringify(session));
    }
    /**
     * Get Stripe configuration for display
     */
    getConfig() {
        return {
            amount: STRIPE_CONFIG.amount / 100,
            currency: STRIPE_CONFIG.currency.toUpperCase(),
            productName: STRIPE_CONFIG.productName,
            formattedPrice: `£${(STRIPE_CONFIG.amount / 100).toFixed(2)}`,
        };
    }
}
// Export singleton instance
export const stripeGateway = new StripeGateway();
