/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_STRIPE_PUBLIC_KEY: string;
  readonly VITE_STRIPE_PRICE_ID: string;
  readonly VITE_COINBASE_COMMERCE_KEY: string;
  readonly VITE_IPFS_GATEWAY: string;
  readonly VITE_PINATA_API_KEY: string;
  readonly VITE_PINATA_SECRET_KEY: string;
  readonly GEMINI_API_KEY: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
