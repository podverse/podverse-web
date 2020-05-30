const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
      browser.url(`${WEB_ORIGIN}/`)
  },
  'Add to Playlist Modal': function (browser) {
    browser

      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)
      
      .click(`.mp-header__add-to`)
      .waitForElementWithText(`.media-list__container:nth-child(1) .media-list-item-a__title`, `Episode 180: Chekhov's Schrödinger's Dagger (Kurosawa's "Rashomon")`)

      .click(`.add-to-modal-create-playlist__create`)
      .sendKeys(`.form-control[name=add-to-modal-create-playlist__title]`, `Test Playlist`)
      .click(`.add-to-modal-create-playlist__save.only-icon.btn.btn-primary`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title`, `Test Playlist`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 0`)
      .click(`.media-list__container:nth-child(4) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 1`)

      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 9`)
      .click(`.media-list__container:nth-child(6) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 10`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 1`)
      .click(`.media-list__container:nth-child(4) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 0`)

      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 10`)
      .click(`.media-list__container:nth-child(6) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 9`)

      .click(`.close-btn`)

      .url(`${WEB_ORIGIN}/episode/rggkv66fR`)

  },
  after: function (browser) {
      browser.end()
  }
}
