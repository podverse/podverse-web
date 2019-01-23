import getConfig from 'next/config'
const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

let env : any = {}

env = {
  NODE_ENV: publicRuntimeConfig.NODE_ENV,
  PROTOCOL: publicRuntimeConfig.PROTOCOL,
  PORT: publicRuntimeConfig.PORT,
  API_PROTOCOL: publicRuntimeConfig.API_PROTOCOL,
  API_PORT: publicRuntimeConfig.API_PORT,
  API_PATH: publicRuntimeConfig.API_PATH,
  API_VERSION: publicRuntimeConfig.API_VERSION,
  COOKIE_DOMAIN: publicRuntimeConfig.COOKIE_DOMAIN,
  COOKIE_PATH: publicRuntimeConfig.COOKIE_PATH,
  PAYPAL_ENV: publicRuntimeConfig.PAYPAL_ENV,
  PAYPAL_CLIENT_ID_PRODUCTION: publicRuntimeConfig.PAYPAL_CLIENT_ID_PRODUCTION,
  PAYPAL_CLIENT_ID_SANDBOX: publicRuntimeConfig.PAYPAL_CLIENT_ID_SANDBOX,
  GOOGLE_ANALYTICS_TRACKING_ID: publicRuntimeConfig.GOOGLE_ANALYTICS_TRACKING_ID,  
}

// For back-end use docker container namespaces,
// for front-end use public domains.
if (Object.keys(serverRuntimeConfig).length > 0) {
  Object.assign(env, {
    DOMAIN: serverRuntimeConfig.DOMAIN,
    API_DOMAIN: serverRuntimeConfig.API_DOMAIN
  })
} else if (Object.keys(publicRuntimeConfig).length > 0) {
  Object.assign(env, {
    DOMAIN: publicRuntimeConfig.PUBLIC_DOMAIN,
    API_DOMAIN: publicRuntimeConfig.PUBLIC_API_DOMAIN
  })
}

export const PROTOCOL = env.PROTOCOL
export const PORT = env.PORT ? parseInt(env.PORT, 10) : 3000
export const DOMAIN = env.DOMAIN
export const BASE_URL = `${PROTOCOL}://${DOMAIN}`

export const API_PROTOCOL = env.API_PROTOCOL
export const API_PORT = env.API_PORT ? parseInt(env.API_PORT, 10) : 1234
export const API_DOMAIN = env.API_DOMAIN
export const API_PATH = env.API_PATH
export const API_VERSION = env.API_VERSION
export const API_BASE_URL = `${API_PROTOCOL}://${API_DOMAIN}/${API_PATH}/${API_VERSION}`

export const cookieConfig = {
  domain: env.COOKIE_DOMAIN ? env.COOKIE_DOMAIN : 'localhost',
  path: env.COOKIE_PATH ? env.COOKIE_PATH : '/'
}

export const paypalConfig = {
  env: env.PAYPAL_ENV,
  production: env.PAYPAL_CLIENT_ID_PRODUCTION,
  sandbox: env.PAYPAL_CLIENT_ID_SANDBOX
}

export const metaDefaultImageUrl1200x630 = 'https://podverse.fm/static/images/podverse-logo-1200x630.png'

export const googleAnalyticsConfig = {
  trackingId: env.GOOGLE_ANALYTICS_TRACKING_ID
}
