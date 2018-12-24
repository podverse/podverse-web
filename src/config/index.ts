export const PROTOCOL = process.env.PROTOCOL ? process.env.PROTOCOL : 'http'
export const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 8765
export const DOMAIN = process.env.DOMAIN ? process.env.DOMAIN : `localhost:${PORT}`

export const cookieConfig = {
  domain: process.env.COOKIE_DOMAIN ? process.env.COOKIE_DOMAIN : 'localhost',
  path: process.env.COOKIE_PATH ? process.env.COOKIE_PATH : '/'
}

export const paypalConfig = {
  env: process.env.NODE_ENV === 'production' ? 'live' : 'sandbox',
  production: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  sandbox: process.env.PAYPAL_CLIENT_ID_SANDBOX
}
