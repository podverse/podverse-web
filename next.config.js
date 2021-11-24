const { i18n } = require('./next-i18next.config')

const envVars = {
  
}

module.exports = {
  reactStrictMode: true,
  i18n,
  serverRuntimeConfig: {
    API_PATH: process.env.API_PATH,
    API_VERSION: process.env.API_VERSION,
    API_DOMAIN: process.env.API_DOMAIN,
    API_PROTOCOL: process.env.API_PROTOCOL,
    WEB_PROTOCOL: process.env.WEB_PROTOCOL,
    WEB_DOMAIN: process.env.WEB_DOMAIN,
    APP_DOWNLOAD_ON_THE_APP_STORE_URL: process.env.APP_DOWNLOAD_ON_THE_APP_STORE_URL,
    APP_GET_IT_ON_FDROID_URL: process.env.APP_GET_IT_ON_FDROID_URL,
    APP_GET_IT_ON_GOOGLE_PLAY_URL: process.env.APP_GET_IT_ON_GOOGLE_PLAY_URL,
    PAYPAL_ENV: process.env.PAYPAL_ENV,
    PAYPAL_CLIENT_ID_PRODUCTION: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
    PAYPAL_CLIENT_ID_SANDBOX: process.env.PAYPAL_CLIENT_ID_SANDBOX,
    EMAIL_CONTACT: process.env.EMAIL_CONTACT
  },
  publicRuntimeConfig: {
    API_PATH: process.env.API_PATH,
    API_VERSION: process.env.API_VERSION,
    API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
    API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
    WEB_PROTOCOL: process.env.PUBLIC_WEB_PROTOCOL,
    WEB_DOMAIN: process.env.PUBLIC_WEB_DOMAIN,
    APP_DOWNLOAD_ON_THE_APP_STORE_URL: process.env.APP_DOWNLOAD_ON_THE_APP_STORE_URL,
    APP_GET_IT_ON_FDROID_URL: process.env.APP_GET_IT_ON_FDROID_URL,
    APP_GET_IT_ON_GOOGLE_PLAY_URL: process.env.APP_GET_IT_ON_GOOGLE_PLAY_URL,
    PAYPAL_ENV: process.env.PAYPAL_ENV,
    PAYPAL_CLIENT_ID_PRODUCTION: process.env.PAYPAL_CLIENT_ID_PRODUCTION,
    PAYPAL_CLIENT_ID_SANDBOX: process.env.PAYPAL_CLIENT_ID_SANDBOX,
    EMAIL_CONTACT: process.env.EMAIL_CONTACT
  }
}
