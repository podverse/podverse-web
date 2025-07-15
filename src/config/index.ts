export const config = {
  api: {
    protocol: process.env.NEXT_PUBLIC_API_PROTOCOL || 'http',
    host: process.env.NEXT_PUBLIC_API_HOST || 'localhost',
    port: process.env.NEXT_PUBLIC_API_PORT || '1234',
    prefix: process.env.NEXT_PUBLIC_API_PREFIX || '/api',
    version: process.env.NEXT_PUBLIC_API_VERSION || '/v2'
  }
}