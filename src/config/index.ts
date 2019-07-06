import getConfig from 'next/config'

export interface Config {
  NODE_ENV?: string
  PROTOCOL?: string
  PORT?: number
  API_PROTOCOL?: string
  API_PATH?: string
  API_VERSION?: string
  QUERY_EPISODES_LIMIT: number
  QUERY_MEDIA_REFS_LIMIT: number
  QUERY_PLAYLISTS_LIMIT: number
  QUERY_PODCASTS_LIMIT: number
  QUERY_USERS_LIMIT: number
  COOKIE_DOMAIN?: string
  COOKIE_PATH?: string
  PAYPAL_ENV?: string
  PAYPAL_CLIENT_ID_PRODUCTION?: string
  PAYPAL_CLIENT_ID_SANDBOX?: string
  GOOGLE_ANALYTICS_TRACKING_ID?: string
  DOMAIN?: string
  API_DOMAIN?: string
  BASE_URL?: string
  API_BASE_URL?: string
  cookieConfig?: any
  paypalConfig?: any
  metaDefaultImageUrl1200x630?: string
  googleAnalyticsConfig?: any
  REQUEST_PODCAST_URL?: string
}

export default () => {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

  let config: Config = {
    NODE_ENV: publicRuntimeConfig.NODE_ENV,
    PROTOCOL: publicRuntimeConfig.PROTOCOL,
    PORT: publicRuntimeConfig.PORT,
    API_PROTOCOL: publicRuntimeConfig.API_PROTOCOL,
    API_PATH: publicRuntimeConfig.API_PATH,
    API_VERSION: publicRuntimeConfig.API_VERSION,
    QUERY_EPISODES_LIMIT: publicRuntimeConfig.QUERY_EPISODES_LIMIT,
    QUERY_MEDIA_REFS_LIMIT: publicRuntimeConfig.QUERY_MEDIA_REFS_LIMIT,
    QUERY_PLAYLISTS_LIMIT: publicRuntimeConfig.QUERY_PLAYLISTS_LIMIT,
    QUERY_PODCASTS_LIMIT: publicRuntimeConfig.QUERY_PODCASTS_LIMIT,
    QUERY_USERS_LIMIT: publicRuntimeConfig.QUERY_USERS_LIMIT,
    COOKIE_DOMAIN: publicRuntimeConfig.COOKIE_DOMAIN,
    COOKIE_PATH: publicRuntimeConfig.COOKIE_PATH,
    PAYPAL_ENV: publicRuntimeConfig.PAYPAL_ENV,
    PAYPAL_CLIENT_ID_PRODUCTION: publicRuntimeConfig.PAYPAL_CLIENT_ID_PRODUCTION,
    PAYPAL_CLIENT_ID_SANDBOX: publicRuntimeConfig.PAYPAL_CLIENT_ID_SANDBOX,
    GOOGLE_ANALYTICS_TRACKING_ID: publicRuntimeConfig.GOOGLE_ANALYTICS_TRACKING_ID,
    REQUEST_PODCAST_URL: publicRuntimeConfig.REQUEST_PODCAST_URL
  }

  // For back-end use docker container namespaces,
  // for front-end use public domains.
  if (Object.keys(serverRuntimeConfig).length > 0) {
    Object.assign(config, {
      DOMAIN: serverRuntimeConfig.DOMAIN,
      API_DOMAIN: serverRuntimeConfig.API_DOMAIN,
      API_PROTOCOL: serverRuntimeConfig.API_PROTOCOL
    })
  } else if (Object.keys(publicRuntimeConfig).length > 0) {
    Object.assign(config, {
      DOMAIN: publicRuntimeConfig.PUBLIC_DOMAIN,
      API_DOMAIN: publicRuntimeConfig.PUBLIC_API_DOMAIN,
      API_PROTOCOL: publicRuntimeConfig.PUBLIC_API_PROTOCOL
    })
  }

  config.BASE_URL = `${config.PROTOCOL}://${config.DOMAIN}`
  config.API_BASE_URL = `${config.API_PROTOCOL}://${config.API_DOMAIN}/${config.API_PATH}/${config.API_VERSION}`

  config.cookieConfig = {
    domain: config.COOKIE_DOMAIN,
    path: config.COOKIE_PATH
  }

  config.paypalConfig = {
    env: config.PAYPAL_ENV,
    production: config.PAYPAL_CLIENT_ID_PRODUCTION,
    sandbox: config.PAYPAL_CLIENT_ID_SANDBOX
  }

  config.metaDefaultImageUrl1200x630 = 'https://podverse.fm/static/images/podverse-logo-1200x630.png'

  config.googleAnalyticsConfig = {
    trackingId: config.GOOGLE_ANALYTICS_TRACKING_ID
  }

  return config
}
