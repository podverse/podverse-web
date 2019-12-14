const withCss = require('@zeit/next-css')
const withSass = require('@zeit/next-sass')
const withImages = require('next-images')

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
  QUERY_USERS_LIMIT: process.env.QUERY_USERS_LIMIT,
  COOKIE_DOMAIN: process.env.COOKIE_DOMAIN,
  COOKIE_PATH: process.env.COOKIE_PATH,
  PAYPAL_ENV: process.env.PAYPAL_ENV,
  PAYPAL_CLIENT_ID_PRODUCTION: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  PAYPAL_CLIENT_ID_SANDBOX: process.env.PAYPAL_CLIENT_ID_SANDBOX,
  GOOGLE_ANALYTICS_TRACKING_ID: process.env.GOOGLE_ANALYTICS_TRACKING_ID,
  DOMAIN: process.env.DOMAIN,
  API_DOMAIN: process.env.API_DOMAIN,
  PUBLIC_DOMAIN: process.env.PUBLIC_DOMAIN,
  PUBLIC_API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
  PUBLIC_API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
  REQUEST_PODCAST_URL: process.env.REQUEST_PODCAST_URL
}

module.exports = withImages(withCss(withSass({
  useFileSystemPublicRoutes: false,
  serverRuntimeConfig: {
    ...envVars
  },
  publicRuntimeConfig: {
    ...envVars,
    DOMAIN: process.env.PUBLIC_DOMAIN,
    API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
    API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
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
