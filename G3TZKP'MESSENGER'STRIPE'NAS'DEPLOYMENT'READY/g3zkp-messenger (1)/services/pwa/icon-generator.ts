/**
 * G3ZKP PWA Icon Generator
 * 
 * Generates SVG-based PWA icons programmatically using the G3ZKP logo design.
 * Creates all required sizes for iOS, Android, and web manifest.
 */

/**
 * Icon sizes required for PWA manifest
 */
export const PWA_ICON_SIZES = [72, 96, 128, 144, 152, 192, 384, 512];

/**
 * Apple touch icon sizes
 */
export const APPLE_ICON_SIZES = [120, 152, 167, 180];

/**
 * Favicon sizes
 */
export const FAVICON_SIZES = [16, 32, 48];

/**
 * Generate the G3ZKP logo SVG at specified size
 */
export function generateLogoSVG(size: number): string {
  const scale = size / 200; // Original viewBox is 200x200
  
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" width="${size}" height="${size}">
  <defs>
    <radialGradient id="emblemGlow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
      <stop offset="0%" stop-color="#00f3ff" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="#00f3ff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#00f3ff" stop-opacity="0"/>
    </radialGradient>
    <filter id="glow">
      <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
      <feMerge>
        <feMergeNode in="coloredBlur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  
  <!-- Background -->
  <rect width="200" height="200" fill="#010401"/>
  
  <!-- Outer Atmosphere Glow -->
  <circle cx="100" cy="100" r="95" fill="url(#emblemGlow)" opacity="0.3"/>
  
  <!-- Outer Shell -->
  <circle cx="100" cy="100" r="85" stroke="#00f3ff" stroke-width="0.75" stroke-dasharray="2 4" fill="none" opacity="0.5"/>
  
  <!-- Core Structure - Flower of Life -->
  <g filter="url(#glow)">
    <!-- Main circle -->
    <circle cx="100" cy="100" r="60" stroke="#00f3ff" stroke-width="1.5" fill="none" opacity="0.8"/>
    
    <!-- Hexagonal Lattice -->
    <circle cx="130" cy="100" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="115" cy="126" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="85" cy="126" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="70" cy="100" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="85" cy="74" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    <circle cx="115" cy="74" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.6"/>
    
    <!-- Center circle -->
    <circle cx="100" cy="100" r="30" stroke="#00f3ff" stroke-width="1" fill="none" opacity="0.9"/>
  </g>
  
  <!-- Inner Nodes -->
  ${generateNodes(18, 50, 100)}
  
  <!-- Center Singularity -->
  <circle cx="100" cy="100" r="6" fill="#fff" filter="url(#glow)"/>
  <circle cx="100" cy="100" r="3" fill="#00f3ff"/>
</svg>`;
}

/**
 * Generate orbital nodes
 */
function generateNodes(count: number, radius: number, center: number): string {
  let nodes = '';
  for (let i = 0; i < count; i++) {
    const angle = (i * 20 * Math.PI) / 180;
    const x = center + radius * Math.cos(angle);
    const y = center + radius * Math.sin(angle);
    nodes += `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="2.5" fill="#00f3ff" opacity="0.8"/>`;
  }
  return nodes;
}

/**
 * Generate icon with padding for app stores
 */
export function generatePaddedIconSVG(size: number, padding: number = 0.1): string {
  const paddingPx = size * padding;
  const innerSize = size - (paddingPx * 2);
  
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <rect width="${size}" height="${size}" fill="#010401"/>
  <g transform="translate(${paddingPx}, ${paddingPx})">
    ${generateLogoSVG(innerSize).replace(/<svg[^>]*>|<\/svg>/g, '')}
  </g>
</svg>`;
}

/**
 * Generate maskable icon (with safe zone)
 * Safe zone is the inner 80% for maskable icons
 */
export function generateMaskableIconSVG(size: number): string {
  return generatePaddedIconSVG(size, 0.1);
}

/**
 * Convert SVG to data URL
 */
export function svgToDataUrl(svg: string): string {
  const encoded = encodeURIComponent(svg)
    .replace(/'/g, '%27')
    .replace(/"/g, '%22');
  return `data:image/svg+xml,${encoded}`;
}

/**
 * Convert SVG to PNG using Canvas
 */
export async function svgToPng(svg: string, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      reject(new Error('Failed to get canvas context'));
      return;
    }

    img.onload = () => {
      ctx.drawImage(img, 0, 0, size, size);
      canvas.toBlob((blob) => {
        if (blob) {
          resolve(blob);
        } else {
          reject(new Error('Failed to create blob'));
        }
      }, 'image/png');
    };

    img.onerror = () => {
      reject(new Error('Failed to load SVG'));
    };

    img.src = svgToDataUrl(svg);
  });
}

/**
 * Generate all PWA icons and return as object URLs
 */
export async function generateAllIcons(): Promise<Map<string, string>> {
  const icons = new Map<string, string>();
  
  // PWA manifest icons
  for (const size of PWA_ICON_SIZES) {
    const svg = generateLogoSVG(size);
    icons.set(`icon-${size}x${size}.svg`, svgToDataUrl(svg));
    
    try {
      const png = await svgToPng(svg, size);
      icons.set(`icon-${size}x${size}.png`, URL.createObjectURL(png));
    } catch (error) {
      console.warn(`Failed to generate PNG for size ${size}:`, error);
    }
  }
  
  // Maskable icons
  for (const size of [192, 512]) {
    const svg = generateMaskableIconSVG(size);
    icons.set(`icon-${size}x${size}-maskable.svg`, svgToDataUrl(svg));
    
    try {
      const png = await svgToPng(svg, size);
      icons.set(`icon-${size}x${size}-maskable.png`, URL.createObjectURL(png));
    } catch (error) {
      console.warn(`Failed to generate maskable PNG for size ${size}:`, error);
    }
  }
  
  // Apple touch icons
  for (const size of APPLE_ICON_SIZES) {
    const svg = generatePaddedIconSVG(size, 0.05);
    icons.set(`apple-touch-icon-${size}x${size}.svg`, svgToDataUrl(svg));
    
    try {
      const png = await svgToPng(svg, size);
      icons.set(`apple-touch-icon-${size}x${size}.png`, URL.createObjectURL(png));
    } catch (error) {
      console.warn(`Failed to generate Apple touch icon for size ${size}:`, error);
    }
  }
  
  // Favicon
  const faviconSvg = generateLogoSVG(32);
  icons.set('favicon.svg', svgToDataUrl(faviconSvg));
  
  return icons;
}

/**
 * Get inline SVG icon for use in React components
 */
export function getInlineIcon(size: number = 200): string {
  return generateLogoSVG(size);
}

/**
 * Generate Web App Manifest with proper icons
 */
export function generateManifest(): object {
  const icons = PWA_ICON_SIZES.map(size => ({
    src: `/icons/icon-${size}x${size}.png`,
    sizes: `${size}x${size}`,
    type: 'image/png',
    purpose: 'any',
  }));

  // Add maskable icons
  icons.push({
    src: '/icons/icon-192x192-maskable.png',
    sizes: '192x192',
    type: 'image/png',
    purpose: 'maskable',
  });
  icons.push({
    src: '/icons/icon-512x512-maskable.png',
    sizes: '512x512',
    type: 'image/png',
    purpose: 'maskable',
  });

  return {
    name: 'G3ZKP Messenger',
    short_name: 'G3ZKP',
    description: 'Secure, peer-to-peer encrypted messenger with zero-knowledge proof verification. Your privacy, your keys, your control.',
    start_url: '/index.html',
    display: 'standalone',
    orientation: 'portrait-primary',
    background_color: '#010401',
    theme_color: '#00f3ff',
    categories: ['communication', 'security', 'privacy'],
    icons,
    shortcuts: [
      {
        name: 'New Message',
        short_name: 'Message',
        description: 'Start a new encrypted conversation',
        url: '/#/compose',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
      {
        name: 'Settings',
        short_name: 'Settings',
        description: 'Configure your privacy settings',
        url: '/#/settings',
        icons: [{ src: '/icons/icon-96x96.png', sizes: '96x96' }],
      },
    ],
    screenshots: [
      {
        src: '/screenshots/desktop-1.png',
        sizes: '1920x1080',
        type: 'image/png',
        form_factor: 'wide',
        label: 'G3ZKP Messenger Desktop Interface',
      },
      {
        src: '/screenshots/mobile-1.png',
        sizes: '390x844',
        type: 'image/png',
        form_factor: 'narrow',
        label: 'G3ZKP Messenger Mobile Interface',
      },
    ],
    related_applications: [],
    prefer_related_applications: false,
  };
}

/**
 * PWA Icon Service - manages icon generation and caching
 */
export class PWAIconService {
  private iconCache: Map<string, string> = new Map();
  private initialized = false;

  async initialize(): Promise<void> {
    if (this.initialized) return;
    
    try {
      this.iconCache = await generateAllIcons();
      this.initialized = true;
    } catch (error) {
      console.error('Failed to initialize PWA icons:', error);
    }
  }

  getIcon(name: string): string | undefined {
    return this.iconCache.get(name);
  }

  getAllIcons(): Map<string, string> {
    return new Map(this.iconCache);
  }

  getManifest(): object {
    return generateManifest();
  }

  /**
   * Inject icons into document head
   */
  injectIcons(): void {
    // Favicon
    const faviconSvg = generateLogoSVG(32);
    const existingFavicon = document.querySelector('link[rel="icon"]');
    if (existingFavicon) {
      existingFavicon.setAttribute('href', svgToDataUrl(faviconSvg));
    } else {
      const favicon = document.createElement('link');
      favicon.rel = 'icon';
      favicon.type = 'image/svg+xml';
      favicon.href = svgToDataUrl(faviconSvg);
      document.head.appendChild(favicon);
    }

    // Apple touch icon
    const appleTouchIcon = generatePaddedIconSVG(180, 0.05);
    const existingApple = document.querySelector('link[rel="apple-touch-icon"]');
    if (existingApple) {
      existingApple.setAttribute('href', svgToDataUrl(appleTouchIcon));
    } else {
      const apple = document.createElement('link');
      apple.rel = 'apple-touch-icon';
      apple.href = svgToDataUrl(appleTouchIcon);
      document.head.appendChild(apple);
    }
  }
}

// Export singleton instance
export const pwaIconService = new PWAIconService();
