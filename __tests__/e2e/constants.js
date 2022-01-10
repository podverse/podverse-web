const WEB_PROTOCOL = process.env.TEST_WEB_PROTOCOL || 'https'
const WEB_DOMAIN = process.env.TEST_WEB_DOMAIN || 'stage.podverse.fm'

const BROWSERSTACK = {
  // For an explanation of why localIdentifier is needed:
  // https://github.com/webdriverio/webdriverio/issues/2252
  BROWSERSTACK_LOCAL_IDENTIFER:
    process.env.BROWSERSTACK_LOCAL_IDENTIFER && process.env.BROWSERSTACK_LOCAL_IDENTIFER.replace(/ |:/g, '_')
}

module.exports = {
  BROWSERSTACK,
  WEB_ORIGIN: `${WEB_PROTOCOL}://${WEB_DOMAIN}`
}
