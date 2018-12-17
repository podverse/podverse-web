require('dotenv').config({ path: '/.env' })

module.exports = {
  'process.env.PAYPAL_CLIENT_ID_PRODUCTION': process.env.PAYPAL_CLIENT_ID_PRODUCTION,
  'process.env.PAYPAL_CLIENT_ID_SANDBOX': process.env.PAYPAL_CLIENT_ID_SANDBOX
}
