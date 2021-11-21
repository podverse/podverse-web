const { i18n } = require('./next-i18next.config')

const envVars = {
  
}

module.exports = {
  reactStrictMode: true,
  i18n,
  serverRuntimeConfig: {
    API_DOMAIN: process.env.API_DOMAIN,
    API_PROTOCOL: process.env.API_PROTOCOL,
    API_PATH: process.env.API_PATH,
    API_VERSION: process.env.API_VERSION
  },
  publicRuntimeConfig: {
    API_DOMAIN: process.env.PUBLIC_API_DOMAIN,
    API_PROTOCOL: process.env.PUBLIC_API_PROTOCOL,
    API_PATH: process.env.API_PATH,
    API_VERSION: process.env.API_VERSION
  }
}
