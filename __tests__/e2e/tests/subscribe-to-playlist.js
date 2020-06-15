/* eslint-disable no-unused-expressions */
const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser
        .url(`${WEB_ORIGIN}/`)

  },
  'Subscribe to Playlist': function (browser) {
    
      browser
        .loginUsingModal('premium@stage.podverse.fm')
        .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

        .url(`${WEB_ORIGIN}/playlist/wgOok7Xp`)

      browser.expect.element(`.media-header__subscribe svg[data-prefix="fas"]`).to.be.present
      browser.click(`.media-header__subscribe`)
      browser.refresh()
      browser.expect.element(`.media-header__subscribe svg[data-prefix="far"]`).to.be.present
      browser.click(`.media-header__subscribe`)
      browser.refresh()
      browser.expect.element(`.media-header__subscribe svg[data-prefix="fas"]`).to.be.present
        



  },
  after: function (browser) {
      browser.end()
  }
}
