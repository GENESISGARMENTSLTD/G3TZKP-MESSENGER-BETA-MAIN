// Mock for missing libp2p utils
export const getGlobalThisUnicastIp = () => {
  return '127.0.0.1';
};

export const fetch = globalThis.fetch;

export default { 
  getGlobalThisUnicastIp,
  fetch
};