const WEB_PROTOCOL = process.env.TEST_WEB_PROTOCOL || 'https'
const WEB_DOMAIN = process.env.TEST_WEB_DOMAIN || 'stage.podverse.fm'

module.exports = {
  WEB_ORIGIN: `${WEB_PROTOCOL}://${WEB_DOMAIN}`
}
