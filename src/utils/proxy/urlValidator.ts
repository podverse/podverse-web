import { validateHttpOrHttpsUrl, validateUrlForSSRF } from "podverse-helpers";

/**
 * Validates a URL for proxy use, checking both basic URL format and SSRF vulnerabilities.
 * This is a convenience function that combines validateHttpOrHttpsUrl and validateUrlForSSRF
 * with proxy-specific settings (no private IPs, no localhost in production, HTTP/HTTPS only).
 * 
 * @returns { isValid: boolean, error?: string }
 */
export function validateProxyUrl(url: string | null): { isValid: boolean; error?: string } {
  if (!url) {
    return { isValid: false, error: 'URL is required' };
  }

  // First validate basic URL format (HTTP/HTTPS)
  const urlValidation = validateHttpOrHttpsUrl(url);
  if (!urlValidation.isValid) {
    return urlValidation;
  }

  // Allow localhost in non-production environments (for testing/development)
  // Also allow localhost if ALLOW_LOCALHOST_PROXY is explicitly set (for tools like Lighthouse)
  const isProduction = process.env.NODE_ENV === 'production';
  const allowLocalhostOverride = process.env.ALLOW_LOCALHOST_PROXY === 'true';
  
  // Then validate for SSRF vulnerabilities
  const ssrfValidation = validateUrlForSSRF(url, {
    allowPrivateIPs: false,
    allowLocalhost: !isProduction || allowLocalhostOverride, // Allow localhost when not in production or explicitly enabled
    allowedProtocols: ['http:', 'https:'],
  });

  return ssrfValidation;
}
