import { NextRequest } from "next/server";
import { checkRateLimit } from "../../../utils/proxy/rateLimiter";
import { validateProxyUrl } from "../../../utils/proxy/urlValidator";
import { PROXY } from "../../../utils/proxy/constants";
import { config } from "../../../config";

export async function GET(req: NextRequest) {
  // Rate limiting check
  const rateLimitResult = checkRateLimit(req);
  if (!rateLimitResult.allowed) {
    return new Response("Rate limit exceeded", { 
      status: 429,
      headers: {
        'Retry-After': Math.ceil((rateLimitResult.resetTime - Date.now()) / 1000).toString(),
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
      }
    });
  }

  // Extract URL from query parameters
  const { searchParams } = new URL(req.url);
  const url = searchParams.get("url");
  
  if (!url) {
    return new Response("Missing url parameter", { status: 400 });
  }

  // Validate URL and check for SSRF vulnerabilities
  const urlValidation = validateProxyUrl(url);
  if (!urlValidation.isValid) {
    return new Response(`Invalid URL: ${urlValidation.error}`, { status: 400 });
  }

  // Create AbortController for timeout
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), PROXY.TIMEOUT_MS);

  try {
    // Fetch the resource with timeout
    const response = await fetch(url, {
      headers: {
        "User-Agent": config.proxy.userAgent
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return new Response("Image fetch failed", { status: response.status });
    }

    // Validate Content-Type
    const contentType = response.headers.get("content-type");
    if (!contentType) {
      return new Response("Missing Content-Type header", { status: 400 });
    }

    // Check if Content-Type is an allowed image type
    const contentTypeLower = contentType.toLowerCase().split(';')[0].trim();
    const isAllowedType = PROXY.ALLOWED_CONTENT_TYPES.some(
      allowedType => contentTypeLower === allowedType.toLowerCase()
    );

    if (!isAllowedType) {
      return new Response(`Content-Type not allowed: ${contentType}`, { status: 403 });
    }

    // Stream response with size checking
    const reader = response.body?.getReader();
    if (!reader) {
      return new Response("No response body", { status: 500 });
    }

    const chunks: Uint8Array[] = [];
    let totalSize = 0;

    try {
      while (true) {
        const { done, value } = await reader.read();
        
        if (done) {
          break;
        }

        if (value) {
          totalSize += value.length;
          
          // Check size limit
          if (totalSize > PROXY.SIZE_LIMITS.MAX_RESPONSE_SIZE_BYTES) {
            reader.cancel();
            return new Response("Response too large", { 
              status: 413,
              headers: {
                'X-Max-Size': PROXY.SIZE_LIMITS.MAX_RESPONSE_SIZE_BYTES.toString(),
              }
            });
          }
          
          chunks.push(value);
        }
      }
    } finally {
      reader.releaseLock();
    }

    // Combine chunks into single buffer
    const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
    const combined = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of chunks) {
      combined.set(chunk, offset);
      offset += chunk.length;
    }

    // Return response with rate limit headers
    return new Response(Buffer.from(combined), {
      headers: { 
        "Content-Type": contentType,
        'X-RateLimit-Limit': '1000',
        'X-RateLimit-Remaining': rateLimitResult.remaining.toString(),
        'X-RateLimit-Reset': new Date(rateLimitResult.resetTime).toISOString(),
      }
    });
  } catch (error) {
    clearTimeout(timeoutId);
    
    // Handle timeout
    if (error instanceof Error && error.name === 'AbortError') {
      return new Response("Request timeout", { status: 504 });
    }
    
    // Handle other fetch errors
    return new Response("Image fetch failed", { status: 500 });
  }
}
