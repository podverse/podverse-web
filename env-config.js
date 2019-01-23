if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}

module.exports = {
  'process.env.NODE_ENV': process.env.NODE_ENV,
  'process.env.PROTOCOL': process.env.PROTOCOL,
  'process.env.PORT': process.env.PORT,
  'process.env.DOMAIN': process.env.DOMAIN,
  'process.env.API_PROTOCOL': process.env.API_PROTOCOL,
  'process.env.API_PORT': process.env.API_PORT,
  'process.env.API_DOMAIN': process.env.API_DOMAIN,
  'process.env.API_PATH': process.env.API_PATH,
  'process.env.API_VERSION': process.env.API_VERSION,
  'process.env.COOKIE_DOMAIN': process.env.COOKIE_DOMAIN,
  'process.env.COOKIE_PATH': process.env.COOKIE_PATH,
  'process.env.PAYPAL_ENV': process.env.PAYPAL_ENV,
  'process.env.PAYPAL_CLIENT_ID_PRODUCTION': process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  'process.env.PAYPAL_CLIENT_ID_SANDBOX': process.env.PAYPAL_CLIENT_ID_SANDBOX,
  'process.env.GOOGLE_ANALYTICS_TRACKING_ID': process.env.GOOGLE_ANALYTICS_TRACKING_ID
}
