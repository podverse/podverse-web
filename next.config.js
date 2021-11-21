const { i18n } = require('./next-i18next.config')

module.exports = {
  reactStrictMode: true,
  i18n,
  publicRuntimeConfig: {
    NEXT_PUBLIC_API_PROTOCOL: process.env.NEXT_PUBLIC_API_PROTOCOL,
    NEXT_PUBLIC_API_DOMAIN: process.env.NEXT_PUBLIC_API_DOMAIN,
    NEXT_PUBLIC_API_PATH: process.env.NEXT_PUBLIC_API_PATH,
    NEXT_PUBLIC_API_VERSION: process.env.NEXT_PUBLIC_API_VERSION
  }
}
