const isPrivateIpv4 = (hostname) => {
  const octets = hostname.split('.').map(Number);
  if (octets.length !== 4 || octets.some((octet) => !Number.isInteger(octet) || octet < 0 || octet > 255)) {
    return false;
  }

  return octets[0] === 10
    || (octets[0] === 172 && octets[1] >= 16 && octets[1] <= 31)
    || (octets[0] === 192 && octets[1] === 168);
};

const isViteDevPort = (port) => {
  const portNumber = Number(port);
  return Number.isInteger(portNumber) && portNumber >= 5173 && portNumber <= 5179;
};

const isAllowedClientOrigin = (origin) => {
  if (!origin) {
    return true;
  }

  const configuredOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((configuredOrigin) => configuredOrigin.trim())
    .filter(Boolean);

  if (configuredOrigins.includes(origin)) {
    return true;
  }

  if (process.env.NODE_ENV === 'production') {
    return false;
  }

  try {
    const parsedOrigin = new URL(origin);
    if (parsedOrigin.protocol !== 'http:' || !isViteDevPort(parsedOrigin.port)) {
      return false;
    }

    const hostname = parsedOrigin.hostname.toLowerCase();
    return hostname === 'localhost'
      || hostname === '127.0.0.1'
      || hostname === '[::1]'
      || isPrivateIpv4(hostname);
  } catch {
    return false;
  }
};

module.exports = isAllowedClientOrigin;
