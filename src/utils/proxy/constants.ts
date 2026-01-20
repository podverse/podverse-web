export const PROXY = {
  RATE_LIMIT: {
    MAX_REQUESTS: 1000,
    WINDOW_MS: 10 * 60 * 1000, // 10 minutes in milliseconds
  },
  SIZE_LIMITS: {
    MAX_RESPONSE_SIZE_BYTES: 10 * 1024 * 1024, // 10 MB
  },
  TIMEOUT_MS: 10 * 1000, // 10 seconds
  ALLOWED_CONTENT_TYPES: [
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'image/svg+xml',
  ],
} as const;
