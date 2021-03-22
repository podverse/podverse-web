const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const { nextI18NextRewrites } = require('next-i18next/rewrites')
const withImages = require('next-images')
const localeSubpaths = {}

global.__basedir = __dirname

const envVars = {
  NODE_ENV: process.env.NODE_ENV,
  PROTOCOL: process.env.PROTOCOL,
  PORT: process.env.PORT,
  API_PROTOCOL: process.env.API_PROTOCOL,
  API_PATH: process.env.API_PATH,
  API_VERSION: process.env.API_VERSION,
  QUERY_EPISODES_LIMIT: process.env.QUERY_EPISODES_LIMIT,
  QUERY_MEDIA_REFS_LIMIT: process.env.QUERY_MEDIA_REFS_LIMIT,
  QUERY_PLAYLISTS_LIMIT: process.env.QUERY_PLAYLISTS_LIMIT,
  QUERY_PODCASTS_LIMIT: process.env.QUERY_PODCASTS_LIMIT,
  QUERY_USER_HISTORY_ITEMS_LIMIT: process.env.QUERY_USER_HISTORY_ITEMS_LIMIT,
  QUERY_USERS_LIMIT: process.env.QUERY_USERS_LIMIT,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  COOKIE_PATH: process.env.COOKIE_PATH,
  COOKIE_KEY_NAMESPACE: process.env.COOKIE_KEY_NAMESPACE,
  PAYPAL_ENV: process.env.PAYPAL_ENV,
  PAYPAL_CLIENT_ID_PRODUCTION: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  PAYPAL_CLIENT_ID_SANDBOX: process.env.PAYPAL_CLIENT_ID_SANDBOX,
  GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  CATEGORY_ID_DEFAULT: process.env.CATEGORY_ID_DEFAULT,
  DOMAIN: process.env.DOMAIN,
  API_DOMAIN: process.env.API_DOMAIN,
  PUBLIC_DOMAIN: process.env.PUBLIC_DOMAIN,
  PUBLIC_API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
  PUBLIC_API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
  REQUEST_PODCAST_URL: process.env.REQUEST_PODCAST_URL,
  SOCIAL_FACEBOOK_IMAGE_URL: process.env.SOCIAL_FACEBOOK_IMAGE_URL,
  SOCIAL_FACEBOOK_PAGE_URL: process.env.SOCIAL_FACEBOOK_PAGE_URL,
  SOCIAL_GITHUB_IMAGE_URL: process.env.SOCIAL_GITHUB_IMAGE_URL,
  SOCIAL_GITHUB_PAGE_URL: process.env.SOCIAL_GITHUB_PAGE_URL,
  SOCIAL_LINKEDIN_IMAGE_URL: process.env.SOCIAL_LINKEDIN_IMAGE_URL,
  SOCIAL_LINKEDIN_PAGE_URL: process.env.SOCIAL_LINKEDIN_PAGE_URL,
  SOCIAL_REDDIT_IMAGE_URL: process.env.SOCIAL_REDDIT_IMAGE_URL,
  SOCIAL_REDDIT_PAGE_URL: process.env.SOCIAL_REDDIT_PAGE_URL,
  SOCIAL_TWITTER_IMAGE_URL: process.env.SOCIAL_TWITTER_IMAGE_URL,
  SOCIAL_TWITTER_PAGE_URL: process.env.SOCIAL_TWITTER_PAGE_URL,
  CONTACT_US_EMAIL: process.env.CONTACT_US_EMAIL,
  APP_DOWNLOAD_ON_THE_APP_STORE_URL: process.env.APP_DOWNLOAD_ON_THE_APP_STORE_URL,
  APP_GET_IT_ON_FDROID_URL: process.env.APP_GET_IT_ON_FDROID_URL,
  APP_GET_IT_ON_GOOGLE_PLAY_URL: process.env.APP_GET_IT_ON_GOOGLE_PLAY_URL,
  APP_PROTOCOL: process.env.APP_PROTOCOL
}

module.exports = withImages(withCss(withSass({
  rewrites: async () => nextI18NextRewrites(localeSubpaths),
  useFileSystemPublicRoutes: false,
  serverRuntimeConfig: {
    ...envVars
  },
  publicRuntimeConfig: {
    ...envVars,
    DOMAIN: process.env.PUBLIC_DOMAIN,
    PUBLIC_DOMAIN: process.env.PUBLIC_DOMAIN,
    API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
    API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
    localeSubpaths
  },
  webpack(config) {
    return {
      ...config,
      node: {
        fs: 'empty'
      }
    }
  }
})))
