/**
 * G3ZKP Services Index
 * 
 * Central export point for all G3ZKP services
 */

// Crypto & License
export {
  licenseManager,
  proofGenerator,
  ZKPLicenseManager,
  ZKPLicenseProofGenerator,
  type LicenseType,
  type LicensePayload,
  type SignedLicense,
  type LicenseVerificationResult,
  type DeviceFingerprint,
} from './crypto/zkp-license';

// Payment Gateways
export {
  stripeGateway,
  StripeGateway,
  type PaymentStatus,
  type PaymentSession,
  type CheckoutOptions,
} from './payments/stripe-gateway';

export {
  cryptoGateway,
  CryptoGateway,
  type CryptoCurrency,
  type CryptoConfig,
  type CryptoPaymentRequest,
  type CryptoPrice,
} from './payments/crypto-gateway';

// Distribution
export {
  ipfsDownloadService,
  IPFSDownloadService,
  type ReleaseInfo,
  type DownloadPackage,
  type DownloadProgress,
} from './distribution/ipfs-download';

// PWA Icons
export {
  pwaIconService,
  PWAIconService,
  generateLogoSVG,
  generateMaskableIconSVG,
  generateManifest,
  svgToDataUrl,
  PWA_ICON_SIZES,
  APPLE_ICON_SIZES,
} from './pwa/icon-generator';
