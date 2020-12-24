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
  QUERY_USER_HISTORY_ITEMS_LIMIT: number
  QUERY_USERS_LIMIT: number
  COOKIE_DOMAIN?: string
  COOKIE_PATH?: string
  COOKIE_KEY_NAMESPACE?: string
  PAYPAL_ENV?: string
  PAYPAL_CLIENT_ID_PRODUCTION?: string
  PAYPAL_CLIENT_ID_SANDBOX?: string
  GOOGLE_ANALYTICS_TRACKING_ID?: string
  CATEGORY_ID_DEFAULT?: string
  DOMAIN?: string
  API_DOMAIN?: string
  BASE_URL?: string
  API_BASE_URL?: string
  cookieConfig?: any
  paypalConfig?: any
  metaDefaultImageUrl1200x630?: string
  googleAnalyticsConfig?: any
  REQUEST_PODCAST_URL?: string
  SOCIAL_FACEBOOK_IMAGE_URL?: string
  SOCIAL_FACEBOOK_PAGE_URL?: string
  SOCIAL_GITHUB_IMAGE_URL?: string
  SOCIAL_GITHUB_PAGE_URL?: string
  SOCIAL_LINKEDIN_IMAGE_URL?: string
  SOCIAL_LINKEDIN_PAGE_URL?: string
  SOCIAL_REDDIT_IMAGE_URL?: string
  SOCIAL_REDDIT_PAGE_URL?: string
  SOCIAL_TWITTER_IMAGE_URL?: string
  SOCIAL_TWITTER_PAGE_URL?: string
  CONTACT_FORM_URL?: string
  APP_DOWNLOAD_ON_THE_APP_STORE_URL: string
  APP_GET_IT_ON_FDROID_URL: string
  APP_GET_IT_ON_GOOGLE_PLAY_URL: string
  APP_PROTOCOL: string
}

export default () => {
  const { serverRuntimeConfig, publicRuntimeConfig } = getConfig()

  const config: Config = {
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
    QUERY_USER_HISTORY_ITEMS_LIMIT: publicRuntimeConfig.QUERY_USER_HISTORY_ITEMS_LIMIT,
    QUERY_USERS_LIMIT: publicRuntimeConfig.QUERY_USERS_LIMIT,
    COOKIE_DOMAIN: publicRuntimeConfig.COOKIE_DOMAIN,
    COOKIE_PATH: publicRuntimeConfig.COOKIE_PATH,
    COOKIE_KEY_NAMESPACE: publicRuntimeConfig.COOKIE_KEY_NAMESPACE,
    PAYPAL_ENV: publicRuntimeConfig.PAYPAL_ENV,
    PAYPAL_CLIENT_ID_PRODUCTION: publicRuntimeConfig.PAYPAL_CLIENT_ID_PRODUCTION,
    PAYPAL_CLIENT_ID_SANDBOX: publicRuntimeConfig.PAYPAL_CLIENT_ID_SANDBOX,
    GOOGLE_ANALYTICS_TRACKING_ID: publicRuntimeConfig.GOOGLE_ANALYTICS_TRACKING_ID,
    CATEGORY_ID_DEFAULT: publicRuntimeConfig.CATEGORY_ID_DEFAULT,
    REQUEST_PODCAST_URL: publicRuntimeConfig.REQUEST_PODCAST_URL,
    SOCIAL_FACEBOOK_PAGE_URL: publicRuntimeConfig.SOCIAL_FACEBOOK_PAGE_URL,
    SOCIAL_GITHUB_IMAGE_URL: publicRuntimeConfig.SOCIAL_GITHUB_IMAGE_URL,
    SOCIAL_GITHUB_PAGE_URL: publicRuntimeConfig.SOCIAL_GITHUB_PAGE_URL,
    SOCIAL_LINKEDIN_IMAGE_URL: publicRuntimeConfig.SOCIAL_LINKEDIN_IMAGE_URL,
    SOCIAL_LINKEDIN_PAGE_URL: publicRuntimeConfig.SOCIAL_LINKEDIN_PAGE_URL,
    SOCIAL_REDDIT_IMAGE_URL: publicRuntimeConfig.SOCIAL_REDDIT_IMAGE_URL,
    SOCIAL_REDDIT_PAGE_URL: publicRuntimeConfig.SOCIAL_REDDIT_PAGE_URL,
    SOCIAL_TWITTER_IMAGE_URL: publicRuntimeConfig.SOCIAL_TWITTER_IMAGE_URL,
    SOCIAL_TWITTER_PAGE_URL: publicRuntimeConfig.SOCIAL_TWITTER_PAGE_URL,
    CONTACT_FORM_URL: publicRuntimeConfig.CONTACT_FORM_URL,
    APP_DOWNLOAD_ON_THE_APP_STORE_URL: publicRuntimeConfig.APP_DOWNLOAD_ON_THE_APP_STORE_URL,
    APP_GET_IT_ON_FDROID_URL: publicRuntimeConfig.APP_GET_IT_ON_FDROID_URL,
    APP_GET_IT_ON_GOOGLE_PLAY_URL: publicRuntimeConfig.APP_GET_IT_ON_GOOGLE_PLAY_URL,
    APP_PROTOCOL: publicRuntimeConfig.APP_PROTOCOL
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
    path: config.COOKIE_PATH,
    keyNamespace: config.COOKIE_KEY_NAMESPACE
  }

  config.paypalConfig = {
    env: config.PAYPAL_ENV,
    production: config.PAYPAL_CLIENT_ID_PRODUCTION,
    sandbox: config.PAYPAL_CLIENT_ID_SANDBOX
  }

  config.metaDefaultImageUrl1200x630 = 'https://podverse.fm/images/podverse-logo-1200x630.png'

  config.googleAnalyticsConfig = {
    trackingId: config.GOOGLE_ANALYTICS_TRACKING_ID
  }

  return config
}
