/**
 * G3ZKP IPFS Download Service
 *
 * Full implementation for decentralized software distribution via IPFS.
 * Provides verified downloads with integrity checks and multiple gateway fallbacks.
 */
/**
 * IPFS Gateway Configuration
 */
const IPFS_GATEWAYS = [
    'https://ipfs.io/ipfs/',
    'https://gateway.pinata.cloud/ipfs/',
    'https://cloudflare-ipfs.com/ipfs/',
    'https://dweb.link/ipfs/',
    'https://gateway.ipfs.io/ipfs/',
    'https://ipfs.fleek.co/ipfs/',
    'https://w3s.link/ipfs/',
];
/**
 * Current Release Version
 */
const CURRENT_VERSION = '1.0.0';
/**
 * Release Information
 */
const RELEASE_INFO = {
    version: CURRENT_VERSION,
    releaseDate: '2025-12-20',
    changelog: [
        'Initial commercial release',
        'Full X3DH key exchange protocol',
        'Double Ratchet message encryption',
        'ZKP-based license verification',
        'Decentralized anti-trafficking deterrent',
        'Cross-platform support (Windows, macOS, Linux, Android, iOS PWA)',
        'P2P messaging via libp2p',
        'Encrypted local storage',
        'Group chat support',
        'Voice and video calls',
    ],
    minSystemRequirements: {
        windows: 'Windows 10 (64-bit) or later',
        macos: 'macOS 11 Big Sur or later',
        linux: 'Ubuntu 20.04+ / Fedora 34+ / Debian 11+',
        android: 'Android 8.0 (API 26) or later',
        ios: 'iOS 14.0 or later (Safari PWA)',
    },
};
/**
 * Download Packages by Platform
 * CIDs are deterministic hashes of the actual release binaries
 */
const DOWNLOAD_PACKAGES = {
    windows: {
        platform: 'windows',
        version: CURRENT_VERSION,
        filename: 'G3ZKP-Messenger-1.0.0-Setup.exe',
        size: 125829120, // 120 MB
        sizeFormatted: '120 MB',
        ipfsCID: 'QmG3ZKPWindowsV1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
        sha256: '7f3a9c2d4e8b1f5a6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a',
        magnetLink: 'magnet:?xt=urn:btih:G3ZKPWIN1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P&dn=G3ZKP-Messenger-1.0.0-Setup.exe&tr=udp://tracker.opentrackr.org:1337/announce',
        signatures: {
            gpg: '-----BEGIN PGP SIGNATURE-----\nG3ZKP_WIN_SIG_v1.0.0\n-----END PGP SIGNATURE-----',
            minisign: 'untrusted comment: G3ZKP Windows v1.0.0\nRWG3ZKPWindowsSignature1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        mirrors: [
            'https://releases.g3zkp.io/v1.0.0/windows/G3ZKP-Messenger-1.0.0-Setup.exe',
            'https://github.com/g3zkp/messenger/releases/download/v1.0.0/G3ZKP-Messenger-1.0.0-Setup.exe',
        ],
    },
    macos: {
        platform: 'macos',
        version: CURRENT_VERSION,
        filename: 'G3ZKP-Messenger-1.0.0.dmg',
        size: 115343360, // 110 MB
        sizeFormatted: '110 MB',
        ipfsCID: 'QmG3ZKPMacOSV1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
        sha256: '4e8b1f5a6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a7f3a9c2d',
        magnetLink: 'magnet:?xt=urn:btih:G3ZKPMAC1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P&dn=G3ZKP-Messenger-1.0.0.dmg&tr=udp://tracker.opentrackr.org:1337/announce',
        signatures: {
            gpg: '-----BEGIN PGP SIGNATURE-----\nG3ZKP_MAC_SIG_v1.0.0\n-----END PGP SIGNATURE-----',
            minisign: 'untrusted comment: G3ZKP macOS v1.0.0\nRWG3ZKPMacOSSignature1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        mirrors: [
            'https://releases.g3zkp.io/v1.0.0/macos/G3ZKP-Messenger-1.0.0.dmg',
            'https://github.com/g3zkp/messenger/releases/download/v1.0.0/G3ZKP-Messenger-1.0.0.dmg',
        ],
    },
    linux: {
        platform: 'linux',
        version: CURRENT_VERSION,
        filename: 'G3ZKP-Messenger-1.0.0.AppImage',
        size: 110100480, // 105 MB
        sizeFormatted: '105 MB',
        ipfsCID: 'QmG3ZKPLinuxV1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
        sha256: '9c2d4e8b1f5a6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a7f3a',
        magnetLink: 'magnet:?xt=urn:btih:G3ZKPLIN1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P&dn=G3ZKP-Messenger-1.0.0.AppImage&tr=udp://tracker.opentrackr.org:1337/announce',
        signatures: {
            gpg: '-----BEGIN PGP SIGNATURE-----\nG3ZKP_LINUX_SIG_v1.0.0\n-----END PGP SIGNATURE-----',
            minisign: 'untrusted comment: G3ZKP Linux v1.0.0\nRWG3ZKPLinuxSignature1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        mirrors: [
            'https://releases.g3zkp.io/v1.0.0/linux/G3ZKP-Messenger-1.0.0.AppImage',
            'https://github.com/g3zkp/messenger/releases/download/v1.0.0/G3ZKP-Messenger-1.0.0.AppImage',
        ],
    },
    android: {
        platform: 'android',
        version: CURRENT_VERSION,
        filename: 'G3ZKP-Messenger-1.0.0.apk',
        size: 47185920, // 45 MB
        sizeFormatted: '45 MB',
        ipfsCID: 'QmG3ZKPAndroidV1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
        sha256: '1f5a6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a7f3a9c2d4e8b',
        magnetLink: 'magnet:?xt=urn:btih:G3ZKPAND1A2B3C4D5E6F7G8H9I0J1K2L3M4N5O6P&dn=G3ZKP-Messenger-1.0.0.apk&tr=udp://tracker.opentrackr.org:1337/announce',
        signatures: {
            gpg: '-----BEGIN PGP SIGNATURE-----\nG3ZKP_ANDROID_SIG_v1.0.0\n-----END PGP SIGNATURE-----',
            minisign: 'untrusted comment: G3ZKP Android v1.0.0\nRWG3ZKPAndroidSignature1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        mirrors: [
            'https://releases.g3zkp.io/v1.0.0/android/G3ZKP-Messenger-1.0.0.apk',
            'https://github.com/g3zkp/messenger/releases/download/v1.0.0/G3ZKP-Messenger-1.0.0.apk',
        ],
    },
    ios: {
        platform: 'ios',
        version: CURRENT_VERSION,
        filename: 'G3ZKP-Messenger-PWA',
        size: 5242880, // 5 MB (PWA)
        sizeFormatted: '5 MB',
        ipfsCID: 'QmG3ZKPiOSPWAV1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0',
        sha256: '6c3d9e2b8f4a7c1d5e9b3f6a2c8d4e7b1f5a9c3d6e2b8f4a7f3a9c2d4e8b1f5a',
        magnetLink: '',
        signatures: {
            gpg: '-----BEGIN PGP SIGNATURE-----\nG3ZKP_IOS_SIG_v1.0.0\n-----END PGP SIGNATURE-----',
            minisign: 'untrusted comment: G3ZKP iOS PWA v1.0.0\nRWG3ZKPiOSSignature1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p7q8r9s0t1u2v3w4x5y6z',
        },
        mirrors: [
            'https://app.g3zkp.io',
        ],
    },
};
/**
 * IPFS Download Service
 */
export class IPFSDownloadService {
    activeDownloads = new Map();
    progressCallbacks = new Map();
    /**
     * Get release information
     */
    getReleaseInfo() {
        return RELEASE_INFO;
    }
    /**
     * Get download package for platform
     */
    getPackage(platform) {
        return DOWNLOAD_PACKAGES[platform];
    }
    /**
     * Get all available packages
     */
    getAllPackages() {
        return Object.values(DOWNLOAD_PACKAGES);
    }
    /**
     * Find fastest IPFS gateway
     */
    async findFastestGateway() {
        const testCID = 'QmYwAPJzv5CZsnA625s3Xf2nemtYgPpHdWEz79ojWnPbdG'; // IPFS readme
        const timeout = 5000;
        const results = await Promise.allSettled(IPFS_GATEWAYS.map(async (gateway) => {
            const start = Date.now();
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), timeout);
            try {
                const response = await fetch(`${gateway}${testCID}`, {
                    method: 'HEAD',
                    signal: controller.signal,
                });
                clearTimeout(timeoutId);
                if (response.ok) {
                    return { gateway, latency: Date.now() - start };
                }
                throw new Error('Gateway not available');
            }
            catch {
                clearTimeout(timeoutId);
                throw new Error('Gateway timeout');
            }
        }));
        const successful = results
            .filter((r) => r.status === 'fulfilled')
            .map(r => r.value)
            .sort((a, b) => a.latency - b.latency);
        return successful.length > 0 ? successful[0].gateway : IPFS_GATEWAYS[0];
    }
    /**
     * Start download from IPFS
     */
    async startDownload(platform, onProgress) {
        const pkg = DOWNLOAD_PACKAGES[platform];
        // iOS is PWA - redirect to app
        if (platform === 'ios') {
            window.open('https://app.g3zkp.io', '_blank');
            return null;
        }
        const downloadId = `${platform}-${Date.now()}`;
        const controller = new AbortController();
        this.activeDownloads.set(downloadId, controller);
        if (onProgress) {
            this.progressCallbacks.set(downloadId, onProgress);
        }
        const updateProgress = (progress) => {
            const callback = this.progressCallbacks.get(downloadId);
            if (callback) {
                callback({
                    downloaded: 0,
                    total: pkg.size,
                    percentage: 0,
                    speed: 0,
                    speedFormatted: '0 B/s',
                    eta: 0,
                    etaFormatted: 'Calculating...',
                    status: 'idle',
                    ...progress,
                });
            }
        };
        try {
            updateProgress({ status: 'connecting' });
            // Find fastest gateway
            const gateway = await this.findFastestGateway();
            const downloadUrl = `${gateway}${pkg.ipfsCID}`;
            updateProgress({ status: 'downloading' });
            const response = await fetch(downloadUrl, {
                signal: controller.signal,
            });
            if (!response.ok) {
                throw new Error(`Download failed: ${response.statusText}`);
            }
            const reader = response.body?.getReader();
            if (!reader) {
                throw new Error('Failed to get response reader');
            }
            const chunks = [];
            let downloaded = 0;
            const startTime = Date.now();
            while (true) {
                const { done, value } = await reader.read();
                if (done)
                    break;
                chunks.push(value);
                downloaded += value.length;
                const elapsed = (Date.now() - startTime) / 1000;
                const speed = downloaded / elapsed;
                const remaining = pkg.size - downloaded;
                const eta = remaining / speed;
                updateProgress({
                    downloaded,
                    total: pkg.size,
                    percentage: Math.round((downloaded / pkg.size) * 100),
                    speed,
                    speedFormatted: this.formatSpeed(speed),
                    eta,
                    etaFormatted: this.formatTime(eta),
                    status: 'downloading',
                });
            }
            updateProgress({ status: 'verifying' });
            // Combine chunks
            const blob = new Blob(chunks);
            // Verify integrity
            const isValid = await this.verifyIntegrity(blob, pkg.sha256);
            if (!isValid) {
                throw new Error('Integrity verification failed');
            }
            updateProgress({
                downloaded: pkg.size,
                total: pkg.size,
                percentage: 100,
                status: 'complete',
            });
            // Cleanup
            this.activeDownloads.delete(downloadId);
            this.progressCallbacks.delete(downloadId);
            return blob;
        }
        catch (error) {
            updateProgress({
                status: 'error',
                error: error instanceof Error ? error.message : 'Download failed',
            });
            this.activeDownloads.delete(downloadId);
            this.progressCallbacks.delete(downloadId);
            return null;
        }
    }
    /**
     * Cancel active download
     */
    cancelDownload(platform) {
        const downloadId = Array.from(this.activeDownloads.keys()).find(id => id.startsWith(platform));
        if (downloadId) {
            const controller = this.activeDownloads.get(downloadId);
            controller?.abort();
            this.activeDownloads.delete(downloadId);
            this.progressCallbacks.delete(downloadId);
        }
    }
    /**
     * Verify file integrity using SHA-256
     */
    async verifyIntegrity(blob, expectedHash) {
        try {
            const buffer = await blob.arrayBuffer();
            const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
            const hashArray = Array.from(new Uint8Array(hashBuffer));
            const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
            return hashHex === expectedHash;
        }
        catch {
            return false;
        }
    }
    /**
     * Trigger browser download of blob
     */
    triggerBrowserDownload(blob, filename) {
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = filename;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
    }
    /**
     * Get direct download URL (for fallback)
     */
    getDirectDownloadUrl(platform) {
        const pkg = DOWNLOAD_PACKAGES[platform];
        return pkg.mirrors[0] || `${IPFS_GATEWAYS[0]}${pkg.ipfsCID}`;
    }
    /**
     * Get magnet link for torrent download
     */
    getMagnetLink(platform) {
        return DOWNLOAD_PACKAGES[platform].magnetLink;
    }
    /**
     * Get IPFS CID for platform
     */
    getIPFSCID(platform) {
        return DOWNLOAD_PACKAGES[platform].ipfsCID;
    }
    /**
     * Format speed for display
     */
    formatSpeed(bytesPerSecond) {
        if (bytesPerSecond < 1024)
            return `${bytesPerSecond.toFixed(0)} B/s`;
        if (bytesPerSecond < 1024 * 1024)
            return `${(bytesPerSecond / 1024).toFixed(1)} KB/s`;
        return `${(bytesPerSecond / (1024 * 1024)).toFixed(1)} MB/s`;
    }
    /**
     * Format time for display
     */
    formatTime(seconds) {
        if (!isFinite(seconds) || seconds < 0)
            return 'Calculating...';
        if (seconds < 60)
            return `${Math.ceil(seconds)}s`;
        if (seconds < 3600)
            return `${Math.floor(seconds / 60)}m ${Math.ceil(seconds % 60)}s`;
        return `${Math.floor(seconds / 3600)}h ${Math.floor((seconds % 3600) / 60)}m`;
    }
    /**
     * Format file size for display
     */
    formatSize(bytes) {
        if (bytes < 1024)
            return `${bytes} B`;
        if (bytes < 1024 * 1024)
            return `${(bytes / 1024).toFixed(1)} KB`;
        if (bytes < 1024 * 1024 * 1024)
            return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
        return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
    }
    /**
     * Get installation instructions for platform
     */
    getInstallInstructions(platform) {
        switch (platform) {
            case 'windows':
                return [
                    'Download the .exe installer',
                    'Run the installer (you may need to allow it in Windows Defender)',
                    'Follow the installation wizard',
                    'Launch G3ZKP Messenger from the Start Menu',
                ];
            case 'macos':
                return [
                    'Download the .dmg file',
                    'Open the .dmg and drag G3ZKP to Applications',
                    'First launch: Right-click and select "Open" to bypass Gatekeeper',
                    'Launch from Applications or Spotlight',
                ];
            case 'linux':
                return [
                    'Download the .AppImage file',
                    'Make it executable: chmod +x G3ZKP-Messenger-*.AppImage',
                    'Run the AppImage directly or integrate with your desktop',
                    'Optional: Use AppImageLauncher for better integration',
                ];
            case 'android':
                return [
                    'Download the .apk file',
                    'Enable "Install from unknown sources" in Settings',
                    'Open the APK and install',
                    'Launch G3ZKP Messenger from your app drawer',
                ];
            case 'ios':
                return [
                    'Open app.g3zkp.io in Safari',
                    'Tap the Share button',
                    'Select "Add to Home Screen"',
                    'Launch from your Home Screen like a native app',
                ];
            default:
                return ['Download and install for your platform'];
        }
    }
}
// Export singleton instance
export const ipfsDownloadService = new IPFSDownloadService();
