const isLoopback = (hostname) => (
  hostname === 'localhost'
  || hostname === '127.0.0.1'
  || hostname === '[::1]'
);

export const resolveBackendUrl = (configuredUrl, fallbackPort, fallbackPath = '') => {
  const browserHostname = window.location.hostname;

  if (!configuredUrl) {
    return `${window.location.protocol}//${browserHostname}:${fallbackPort}${fallbackPath}`;
  }

  try {
    const backendUrl = new URL(configuredUrl);
    if (!isLoopback(browserHostname) && isLoopback(backendUrl.hostname)) {
      backendUrl.hostname = browserHostname;
    }
    return backendUrl.toString().replace(/\/$/, '');
  } catch {
    return configuredUrl;
  }
};
