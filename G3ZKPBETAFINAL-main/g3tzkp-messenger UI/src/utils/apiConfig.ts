export const getApiUrl = (): string => {
  // Check for environment variable first (for production deployment)
  const envApiUrl = import.meta.env.VITE_API_URL;
  if (envApiUrl) {
    return envApiUrl;
  }

  if (typeof window !== 'undefined') {
    const hostname = window.location.hostname;
    const isSecure = window.location.protocol === 'https:';
    
    // Local development
    if (hostname === 'localhost' || hostname === '127.0.0.1') {
      return `http://${hostname}:3001`;
    }
    
    // Production fallback: assume same origin or try to construct
    const port = window.location.port || (isSecure ? '443' : '80');
    // If on Render frontend, backend might be on a different URL, 
    // but without env var we can only guess or default to same origin if proxy is set up.
    // However, Render setup usually requires the env var.
    return isSecure 
      ? `https://${hostname}${port !== '443' ? ':' + port : ''}`
      : `http://${hostname}${port !== '80' ? ':' + port : ''}`;
  }
  
  return 'http://localhost:3001';
};

export const getWsUrl = (): string => {
  const httpUrl = getApiUrl();
  return httpUrl.replace(/^http/, 'ws');
};
