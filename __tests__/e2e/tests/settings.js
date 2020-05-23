module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/settings')
  },
  'Settings Page': function (browser) {
    browser
      .waitForElementWithText('h3', 'Settings')
      .testSharedMetaTags()
      .testPageMetaTags(
        'Podverse - Settings',
        'Customize your account settings on Podverse.'
      )
  },
  after: function (browser) {
    browser.end()
  }
};
