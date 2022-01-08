/* eslint-disable no-unused-expressions */
const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Subscribe to Podcast': function (browser) {
    browser
      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .url(`${WEB_ORIGIN}/podcast/kS9ZnQNWlQc`)

    browser.expect.element(`.pill.centered-axis-xy-wrapper.is-active`).to.be.present
    browser.click(`.pill.centered-axis-xy-wrapper`)
    browser.refresh()
    browser.expect.element(`.pill.centered-axis-xy-wrapper.is-active`).to.not.be.present
    browser.click(`.pill.centered-axis-xy-wrapper`)
    browser.refresh()
    browser.expect.element(`.pill.centered-axis-xy-wrapper.is-active`).to.be.present
  },
  after: function (browser) {
    browser.end()
  }
}
