module.exports = {
  before: function (browser) {
    browser.url('https://stage.podverse.fm/')
  },
  'Playlist Tests': function (browser) {
    browser
      .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')
      .loginUsingModal(`premium@stage.podverse.fm`)
      
      .url('https://stage.podverse.fm/playlist/-67KgiG1')
      .waitForElementWithText('div', 'Diam quis enim lobortis scelerisque fermentum dui faucibus.')

      .testSharedMetaTags()
      .testPageMetaTags(
        `Test Playlist 1`,
        `Test Playlist 1 - playlist on Podverse `
      )
  },
  after: function (browser) {
      browser.end()
  }
};
