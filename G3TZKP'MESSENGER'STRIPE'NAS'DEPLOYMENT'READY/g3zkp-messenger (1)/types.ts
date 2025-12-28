
export type Platform = 'ios' | 'android' | 'windows' | 'macos' | 'linux';

export interface LicenseInfo {
  id: string;
  key: string;
  type: 'trial' | 'full';
  expiresAt?: string;
  isActive: boolean;
}

export interface DownloadInfo {
  platform: Platform;
  version: string;
  magnetLink: string;
  ipfsHash: string;
}
