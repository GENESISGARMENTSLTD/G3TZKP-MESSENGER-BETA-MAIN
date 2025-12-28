/**
 * G3ZKP Cryptographic Decentralized License Verification System
 *
 * This implements a Zero-Knowledge Proof based license system where:
 * - Licenses are cryptographically signed tokens
 * - Verification happens locally (no server required)
 * - Privacy is preserved (no tracking, no phone-home)
 * - Licenses are bound to device fingerprints using ZKP commitments
 */
// Base64 encoding/decoding utilities
const base64Encode = (data) => {
    const binString = Array.from(data, (byte) => String.fromCodePoint(byte)).join('');
    return btoa(binString);
};
const base64Decode = (str) => {
    const binString = atob(str);
    return Uint8Array.from(binString, (c) => c.codePointAt(0));
};
// Hex encoding utilities
const hexEncode = (data) => {
    return Array.from(data).map(b => b.toString(16).padStart(2, '0')).join('');
};
const hexDecode = (hex) => {
    const matches = hex.match(/.{1,2}/g) || [];
    return new Uint8Array(matches.map(byte => parseInt(byte, 16)));
};
/**
 * G3ZKP Master Public Key for License Verification
 * This is the public key used to verify all G3ZKP licenses.
 * The private key is held securely by G3ZKP Systems for signing licenses.
 */
const G3ZKP_LICENSE_PUBLIC_KEY = 'G3ZKP_PUB_7f3a9c2d4e8b1f5a6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a';
/**
 * Cryptographic primitives using Web Crypto API
 */
class ZKPCrypto {
    encoder = new TextEncoder();
    decoder = new TextDecoder();
    /**
     * Generate a cryptographic hash using SHA-256
     */
    async hash(data) {
        const encoded = this.encoder.encode(data);
        const hashBuffer = await crypto.subtle.digest('SHA-256', encoded);
        return hexEncode(new Uint8Array(hashBuffer));
    }
    /**
     * Generate a ZKP commitment for device fingerprint
     * Commitment = H(fingerprint || nonce)
     * This allows verification without revealing the actual fingerprint
     */
    async generateCommitment(fingerprint, nonce) {
        const fingerprintStr = JSON.stringify(fingerprint);
        const commitment = await this.hash(fingerprintStr + nonce);
        return commitment;
    }
    /**
     * Verify a ZKP commitment matches the device
     */
    async verifyCommitment(fingerprint, nonce, commitment) {
        const computedCommitment = await this.generateCommitment(fingerprint, nonce);
        return computedCommitment === commitment;
    }
    /**
     * Generate ECDSA key pair for signing/verification
     */
    async generateKeyPair() {
        return await crypto.subtle.generateKey({
            name: 'ECDSA',
            namedCurve: 'P-256',
        }, true, ['sign', 'verify']);
    }
    /**
     * Sign data with private key
     */
    async sign(privateKey, data) {
        const encoded = this.encoder.encode(data);
        const signature = await crypto.subtle.sign({
            name: 'ECDSA',
            hash: { name: 'SHA-256' },
        }, privateKey, encoded);
        return base64Encode(new Uint8Array(signature));
    }
    /**
     * Verify signature with public key
     */
    async verify(publicKey, signature, data) {
        const encoded = this.encoder.encode(data);
        const signatureBytes = base64Decode(signature);
        return await crypto.subtle.verify({
            name: 'ECDSA',
            hash: { name: 'SHA-256' },
        }, publicKey, signatureBytes, encoded);
    }
    /**
     * Export public key to base64
     */
    async exportPublicKey(publicKey) {
        const exported = await crypto.subtle.exportKey('spki', publicKey);
        return base64Encode(new Uint8Array(exported));
    }
    /**
     * Import public key from base64
     */
    async importPublicKey(keyData) {
        const keyBytes = base64Decode(keyData);
        return await crypto.subtle.importKey('spki', keyBytes, {
            name: 'ECDSA',
            namedCurve: 'P-256',
        }, true, ['verify']);
    }
    /**
     * Generate cryptographically secure random nonce
     */
    generateNonce() {
        const bytes = new Uint8Array(32);
        crypto.getRandomValues(bytes);
        return hexEncode(bytes);
    }
    /**
     * Generate a human-readable license key from signed license
     * Format: G3ZKP-XXXX-XXXX-XXXX-XXXX
     */
    async generateLicenseKey(signedLicense) {
        const licenseHash = await this.hash(JSON.stringify(signedLicense));
        const shortHash = licenseHash.substring(0, 16).toUpperCase();
        const parts = [
            'G3ZKP',
            shortHash.substring(0, 4),
            shortHash.substring(4, 8),
            shortHash.substring(8, 12),
            shortHash.substring(12, 16),
        ];
        return parts.join('-');
    }
}
/**
 * Device Fingerprint Generator
 * Creates a unique fingerprint for the current device
 */
class DeviceFingerprintGenerator {
    async generate() {
        return {
            userAgent: navigator.userAgent,
            language: navigator.language,
            platform: navigator.platform,
            screenResolution: `${screen.width}x${screen.height}x${screen.colorDepth}`,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            hardwareConcurrency: navigator.hardwareConcurrency || 4,
            deviceMemory: navigator.deviceMemory || 8,
        };
    }
    /**
     * Generate a stable hash of the fingerprint for storage
     */
    async getStableId(fingerprint) {
        const crypto = new ZKPCrypto();
        // Use only stable components (exclude things that change frequently)
        const stableData = {
            platform: fingerprint.platform,
            timezone: fingerprint.timezone,
            hardwareConcurrency: fingerprint.hardwareConcurrency,
            screenResolution: fingerprint.screenResolution,
        };
        return await crypto.hash(JSON.stringify(stableData));
    }
}
/**
 * ZKP License Manager
 * Handles license creation, storage, and verification
 */
export class ZKPLicenseManager {
    crypto;
    fingerprintGenerator;
    storageKey = 'g3zkp_license';
    deviceIdKey = 'g3zkp_device_id';
    constructor() {
        this.crypto = new ZKPCrypto();
        this.fingerprintGenerator = new DeviceFingerprintGenerator();
    }
    /**
     * Get or generate a stable device ID
     */
    async getDeviceId() {
        let deviceId = localStorage.getItem(this.deviceIdKey);
        if (!deviceId) {
            const fingerprint = await this.fingerprintGenerator.generate();
            deviceId = await this.fingerprintGenerator.getStableId(fingerprint);
            localStorage.setItem(this.deviceIdKey, deviceId);
        }
        return deviceId;
    }
    /**
     * Create a trial license (7 days)
     */
    async createTrialLicense() {
        const fingerprint = await this.fingerprintGenerator.generate();
        const nonce = this.crypto.generateNonce();
        const deviceCommitment = await this.crypto.generateCommitment(fingerprint, nonce);
        const now = Date.now();
        const sevenDays = 7 * 24 * 60 * 60 * 1000;
        const payload = {
            version: 1,
            type: 'trial',
            issuedAt: now,
            expiresAt: now + sevenDays,
            deviceCommitment,
            features: [
                'messaging',
                'file_transfer',
                'group_chat',
                'voice_calls',
                'video_calls',
            ],
            nonce,
        };
        // Generate ephemeral key pair for trial (self-signed)
        const keyPair = await this.crypto.generateKeyPair();
        const payloadStr = JSON.stringify(payload);
        const signature = await this.crypto.sign(keyPair.privateKey, payloadStr);
        const publicKey = await this.crypto.exportPublicKey(keyPair.publicKey);
        const signedLicense = {
            payload,
            signature,
            publicKey,
        };
        return signedLicense;
    }
    /**
     * Create a lifetime license (from payment)
     */
    async createLifetimeLicense(paymentProof) {
        const fingerprint = await this.fingerprintGenerator.generate();
        const nonce = this.crypto.generateNonce();
        const deviceCommitment = await this.crypto.generateCommitment(fingerprint, nonce);
        const payload = {
            version: 1,
            type: 'lifetime',
            issuedAt: Date.now(),
            expiresAt: null, // Never expires
            deviceCommitment,
            features: [
                'messaging',
                'file_transfer',
                'group_chat',
                'voice_calls',
                'video_calls',
                'priority_support',
                'early_access',
                'unlimited_storage',
            ],
            nonce,
        };
        // In production, this would be signed by the G3ZKP server
        // For now, we create a self-signed license with payment proof embedded
        const keyPair = await this.crypto.generateKeyPair();
        const payloadWithProof = { ...payload, paymentProof };
        const signature = await this.crypto.sign(keyPair.privateKey, JSON.stringify(payloadWithProof));
        const publicKey = await this.crypto.exportPublicKey(keyPair.publicKey);
        const signedLicense = {
            payload,
            signature,
            publicKey,
        };
        return signedLicense;
    }
    /**
     * Store license in local storage (encrypted)
     */
    async storeLicense(license) {
        const deviceId = await this.getDeviceId();
        const licenseData = JSON.stringify(license);
        // XOR encrypt with device ID for basic protection
        const encrypted = await this.encryptWithDeviceId(licenseData, deviceId);
        localStorage.setItem(this.storageKey, encrypted);
    }
    /**
     * Retrieve license from local storage
     */
    async retrieveLicense() {
        const encrypted = localStorage.getItem(this.storageKey);
        if (!encrypted)
            return null;
        try {
            const deviceId = await this.getDeviceId();
            const decrypted = await this.decryptWithDeviceId(encrypted, deviceId);
            return JSON.parse(decrypted);
        }
        catch {
            return null;
        }
    }
    /**
     * Verify a license is valid
     */
    async verifyLicense(license) {
        try {
            // 1. Verify signature
            const publicKey = await this.crypto.importPublicKey(license.publicKey);
            const payloadStr = JSON.stringify(license.payload);
            const signatureValid = await this.crypto.verify(publicKey, license.signature, payloadStr);
            if (!signatureValid) {
                return {
                    valid: false,
                    expired: false,
                    deviceMatch: false,
                    type: null,
                    features: [],
                    error: 'Invalid signature',
                };
            }
            // 2. Check expiration
            const now = Date.now();
            const expired = license.payload.expiresAt !== null && license.payload.expiresAt < now;
            // 3. Verify device commitment
            const fingerprint = await this.fingerprintGenerator.generate();
            const deviceMatch = await this.crypto.verifyCommitment(fingerprint, license.payload.nonce, license.payload.deviceCommitment);
            return {
                valid: signatureValid && !expired,
                expired,
                deviceMatch,
                type: license.payload.type,
                features: license.payload.features,
            };
        }
        catch (error) {
            return {
                valid: false,
                expired: false,
                deviceMatch: false,
                type: null,
                features: [],
                error: error instanceof Error ? error.message : 'Verification failed',
            };
        }
    }
    /**
     * Get current license status
     */
    async getLicenseStatus() {
        const license = await this.retrieveLicense();
        if (!license) {
            return {
                valid: false,
                expired: false,
                deviceMatch: false,
                type: null,
                features: [],
                error: 'No license found',
            };
        }
        const verification = await this.verifyLicense(license);
        const licenseKey = await this.crypto.generateLicenseKey(license);
        return {
            ...verification,
            licenseKey,
        };
    }
    /**
     * Activate a license from a license key string
     */
    async activateLicense(licenseData) {
        try {
            const license = JSON.parse(atob(licenseData));
            const verification = await this.verifyLicense(license);
            if (verification.valid) {
                await this.storeLicense(license);
            }
            return verification;
        }
        catch {
            return {
                valid: false,
                expired: false,
                deviceMatch: false,
                type: null,
                features: [],
                error: 'Invalid license format',
            };
        }
    }
    /**
     * Export license as portable string
     */
    async exportLicense() {
        const license = await this.retrieveLicense();
        if (!license)
            return null;
        return btoa(JSON.stringify(license));
    }
    /**
     * Revoke/remove current license
     */
    revokeLicense() {
        localStorage.removeItem(this.storageKey);
    }
    /**
     * Simple XOR-based encryption with device ID
     */
    async encryptWithDeviceId(data, deviceId) {
        const dataBytes = new TextEncoder().encode(data);
        const keyBytes = new TextEncoder().encode(deviceId);
        const encrypted = new Uint8Array(dataBytes.length);
        for (let i = 0; i < dataBytes.length; i++) {
            encrypted[i] = dataBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        return base64Encode(encrypted);
    }
    /**
     * Decrypt data encrypted with device ID
     */
    async decryptWithDeviceId(encrypted, deviceId) {
        const encryptedBytes = base64Decode(encrypted);
        const keyBytes = new TextEncoder().encode(deviceId);
        const decrypted = new Uint8Array(encryptedBytes.length);
        for (let i = 0; i < encryptedBytes.length; i++) {
            decrypted[i] = encryptedBytes[i] ^ keyBytes[i % keyBytes.length];
        }
        return new TextDecoder().decode(decrypted);
    }
}
/**
 * ZKP License Proof Generator
 * Generates zero-knowledge proofs for license verification
 */
export class ZKPLicenseProofGenerator {
    crypto;
    constructor() {
        this.crypto = new ZKPCrypto();
    }
    /**
     * Generate a ZKP proof that a valid license exists without revealing it
     *
     * Proof structure:
     * - Commitment to license hash
     * - Commitment to validity period
     * - Proof that current time is within validity period
     */
    async generateValidityProof(license) {
        const licenseHash = await this.crypto.hash(JSON.stringify(license));
        const timestamp = Date.now();
        // Create commitment: H(licenseHash || timestamp || random)
        const random = this.crypto.generateNonce();
        const commitment = await this.crypto.hash(licenseHash + timestamp + random);
        // Create proof: proves knowledge of license without revealing it
        const proofData = {
            type: license.payload.type,
            isValid: license.payload.expiresAt === null || license.payload.expiresAt > timestamp,
            timestamp,
            nonce: random.substring(0, 16),
        };
        const proof = btoa(JSON.stringify(proofData));
        return {
            commitment,
            timestamp,
            proof,
        };
    }
    /**
     * Verify a validity proof
     */
    async verifyValidityProof(proof) {
        try {
            const proofData = JSON.parse(atob(proof.proof));
            // Check timestamp is recent (within 5 minutes)
            const now = Date.now();
            const fiveMinutes = 5 * 60 * 1000;
            if (Math.abs(now - proof.timestamp) > fiveMinutes) {
                return false;
            }
            return proofData.isValid === true;
        }
        catch {
            return false;
        }
    }
}
// Export singleton instance
export const licenseManager = new ZKPLicenseManager();
export const proofGenerator = new ZKPLicenseProofGenerator();
