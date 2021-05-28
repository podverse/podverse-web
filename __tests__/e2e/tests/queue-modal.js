const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser
        .url(`${WEB_ORIGIN}/`)

  },
  'Queue Modal': function (browser) {
    browser
      
      // .waitForElementWithText(`.media-list__container:nth-child(2) .media-list__item .media-list-item-a__title`, `Amet aliquam id diam maecenas ultricies mi eget.`)

      // .waitForElementWithText(`.scrollable-area div[data-rbd-draggable-id="secondary-item-1"] .media-list-item-a__title`,`Ornare aenean euismod elementum nisi quis eleifend quam adipiscing vitae.`)
      
      // .click(`.queue-modal-header__edit .btn.btn-secondary`)

      // .click(`.scrollable-area div[data-rbd-draggable-id="secondary-item-1"] .media-list-right__remove`)

      // .waitForElementWithText(`.scrollable-area div[data-rbd-draggable-id="secondary-item-1"] .media-list-item-a__title`,`Lacus sed turpis tincidunt id aliquet risus feugiat in ante.`)

  },
  after: function (browser) {
      browser.end()
  }
}
