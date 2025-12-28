/**
 * G3ZKP Services Index
 *
 * Central export point for all G3ZKP services
 */
// Crypto & License
export { licenseManager, proofGenerator, ZKPLicenseManager, ZKPLicenseProofGenerator, } from './crypto/zkp-license';
// Payment Gateways
export { stripeGateway, StripeGateway, } from './payments/stripe-gateway';
export { cryptoGateway, CryptoGateway, } from './payments/crypto-gateway';
// Distribution
export { ipfsDownloadService, IPFSDownloadService, } from './distribution/ipfs-download';
// PWA Icons
export { pwaIconService, PWAIconService, generateLogoSVG, generateMaskableIconSVG, generateManifest, svgToDataUrl, PWA_ICON_SIZES, APPLE_ICON_SIZES, } from './pwa/icon-generator';
