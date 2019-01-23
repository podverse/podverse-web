export const PROTOCOL = process.env.PROTOCOL
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000
export const DOMAIN = process.env.DOMAIN ? process.env.DOMAIN : `localhost:${PORT}`
export const BASE_URL = `${PROTOCOL}://${DOMAIN}`

export const API_PROTOCOL = process.env.API_PROTOCOL
export const API_PORT = process.env.API_PORT ? parseInt(process.env.API_PORT, 10) : 1234
export const API_DOMAIN = process.env.API_DOMAIN ? process.env.API_DOMAIN : `localhost:${API_PORT}`
export const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}`

export const cookieConfig = {
  domain: process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : 'localhost',
  path: process.env.COOKIE_PATH ? process.env.COOKIE_PATH : '/'
}

export const paypalConfig = {
  env: process.env.PAYPAL_ENV,
  production: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  sandbox: process.env.PAYPAL_CLIENT_ID_SANDBOX
}

export const metaDefaultImageUrl1200x630 = 'https://podverse.fm/static/images/podverse-logo-1200x630.png'

export const googleAnalyticsConfig = {
  trackingId: process.env.GOOGLE_ANALYTICS_TRACKING_ID
}
