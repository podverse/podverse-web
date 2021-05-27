/* eslint-disable no-unused-expressions */
const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser
        .url(`${WEB_ORIGIN}/`)

  },
  'Share Modal': function (browser) {
    
      // browser.click(`.mp-header__share`)
      // browser.expect.element(`input[id="share-copy-clip-input"][value="https://stage.podverse.fm/clip/9rA5BhWp"]`).to.be.present
      // browser.expect.element(`input[id="share-copy-episode-input"][value="https://stage.podverse.fm/episode/fFmGXkgIM"]`).to.be.present
      // browser.expect.element(`input[id="share-copy-podcast-input"][value="https://stage.podverse.fm/podcast/zRo1jwx67"]`).to.be.present

  },
  after: function (browser) {
      browser.end()
  }
}
