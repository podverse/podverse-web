const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  i18n,
  publicRuntimeConfig: {
    API_PROTOCOL: process.env.API_PROTOCOL,
    API_DOMAIN: process.env.API_DOMAIN,
    API_PATH: process.env.API_PATH,
    API_VERSION: process.env.API_VERSION
  }
}
