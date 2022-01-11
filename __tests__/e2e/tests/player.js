const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Player': function (browser) {
    browser
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select')
      .click('.dropdowns .dropdown-primary-wrapper .react-dropdown-select .react-dropdown-select-dropdown .react-dropdown-select-item:nth-child(1)')
      .click('.podcast-list-item:nth-child(5)')
      .waitForElementWithText('.podcast-page-header .podcast-title a', 'The Joe Rogan Experience')
      .waitForElementWithText('.page-scrollable-content .page-header h2', 'Episodes')
      .click('ul.list li.episode-list-item div.main-wrapper div.media-item-controls button.button-circle.medium.play')

      // .waitForElementPresent('div.player div.player-progress-container button.player-progress-button.medium:nth-child(1)')  //Double left
      .waitForElementPresent('div.player div.player-progress-container button.player-progress-button.medium:nth-child(2)')  //Rewind 10 seconds
      //nth-child(3) = Play button but has different hierarchy
      .waitForElementPresent('div.player div.player-progress-container button.button-circle.medium.pause') //Pause-Play
      .click('div.player div.player-progress-container button.button-circle.medium.pause')
      .waitForElementPresent('div.player div.player-progress-container button.button-circle.medium.play') //Play-Pause
      .waitForElementPresent('div.player div.player-progress-container button.player-progress-button.medium:nth-child(4)')  //Fast-forward 30 seconds
      .waitForElementPresent('div.player div.player-progress-container button.player-progress-button.medium:nth-child(5)')  //Double right

      .waitForElementPresent('div.player div.player-buttons-container button.player-option-button.small:nth-child(1)')  //Make Clip
      .waitForElementPresent('div.player div.player-buttons-container button.player-option-button.small:nth-child(2)')  //Add to Playlist
      .waitForElementPresent('div.player div.player-buttons-container:nth-child(3) button.player-option-button.small:nth-child(3)')  //Make Clip
      .waitForElementPresent('div.player div.player-buttons-container:nth-child(3) .player-control-volume-wrapper button.player-option-button.small:nth-child(3)')  //Fullscreen

      .click('div.player div.player-buttons-container:nth-child(3) .player-control-volume-wrapper button.player-option-button.small:nth-child(3)')  //Go Fullscreen

      // .waitForElementPresent('div.player-full-view div.player-progress-container button.player-progress-button.medium:nth-child(1)')  //Double left
      .waitForElementPresent('div.player-full-view div.player-progress-container button.player-progress-button.medium:nth-child(2)')  //Rewind 10 seconds
      //nth-child(3) = Play button but has different hierarchy
      .waitForElementPresent('div.player-full-view div.player-progress-container button.button-circle.medium.play') //Pause-Play
      .click('div.player-full-view div.player-progress-container button.button-circle.medium.play')
      .waitForElementPresent('div.player-full-view div.player-progress-container button.button-circle.medium.pause') //Play-Pause
      .waitForElementPresent('div.player-full-view div.player-progress-container button.player-progress-button.medium:nth-child(4)')  //Fast-forward 30 seconds
      .waitForElementPresent('div.player-full-view div.player-progress-container button.player-progress-button.medium:nth-child(5)')  //Double right



      






  },
  after: function (browser) {
    browser.end()
  }
}
