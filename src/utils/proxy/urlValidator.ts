import { validateHttpOrHttpsUrl, validateUrlForSSRF } from "podverse-helpers";

/**
 * Validates a URL for proxy use, checking both basic URL format and SSRF vulnerabilities.
 * This is a convenience function that combines validateHttpOrHttpsUrl and validateUrlForSSRF
 * with proxy-specific settings (no private IPs, no localhost, HTTP/HTTPS only).
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

  // Then validate for SSRF vulnerabilities
  const ssrfValidation = validateUrlForSSRF(url, {
    allowPrivateIPs: false,
    allowLocalhost: false,
    allowedProtocols: ['http:', 'https:'],
  });

  return ssrfValidation;
}
