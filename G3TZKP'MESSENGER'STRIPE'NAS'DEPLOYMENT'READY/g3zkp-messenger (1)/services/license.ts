
import { LicenseInfo } from '../types';

export const generateLicenseKey = (): string => {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let key = '';
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    if (i < 3) key += '-';
  }
  return key;
};

export const createTrialLicense = (email: string): LicenseInfo => {
  const expiry = new Date();
  expiry.setDate(expiry.getDate() + 7);
  
  return {
    id: crypto.randomUUID(),
    key: generateLicenseKey(),
    type: 'trial',
    expiresAt: expiry.toISOString(),
    isActive: true,
  };
};

export const validateLicense = async (key: string): Promise<LicenseInfo | null> => {
  // Simulate API validation
  return new Promise((resolve) => {
    setTimeout(() => {
      if (key.length > 10) {
        resolve({
          id: crypto.randomUUID(),
          key: key,
          type: 'full',
          isActive: true
        });
      } else {
        resolve(null);
      }
    }, 1000);
  });
};
