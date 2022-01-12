const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser._resetDatabase().url(`${WEB_ORIGIN}/`)
  },
  'Add to Playlist Modal': function (browser) {
    browser

      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .click(`.more-dropdown-menu`)
      .click(`.media-list__right .dropdown-menu .dropdown-item`)

      .click(`.mp-header__add-to`)
      .waitForElementWithText(
        `.media-list__container:nth-child(1) .media-list-item-a__title`,
        `Lacus sed turpis tincidunt id aliquet risus feugiat in ante.`
      )

      .click(`.add-to-modal-create-playlist__create`)
      .sendKeys(`.form-control[name=add-to-modal-create-playlist__title]`, `__Test__Playlist`)
      .click(`.add-to-modal-create-playlist__save.only-icon.btn.btn-primary`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title`, `__Test__Playlist`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 0`)
      .click(`.media-list__container:nth-child(4) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 1`)

      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 9`)
      .click(`.media-list__container:nth-child(6) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 8`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 1`)
      .click(`.media-list__container:nth-child(4) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-d__title-side`, `items: 0`)

      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 8`)
      .click(`.media-list__container:nth-child(6) .media-list-item-d__title`)
      .waitForElementWithText(`.media-list__container:nth-child(6) .media-list-item-d__title-side`, `items: 9`)

      .click(`.close-btn`)

      .refresh()

      .url(`${WEB_ORIGIN}/episode/rggkv66fR`)

      .click(`.more-dropdown-menu`)
      .click(`.more-dropdown-menu.dropright.dropdown.show .dropdown-menu.show .dropdown-item:nth-child(3)`)

      .waitForElementWithText(
        `.add-to-modal.over-media-player .media-list-item-a__title`,
        `Episode 180: Chekhov's Schrödinger's Dagger (Kurosawa's "Rashomon")`
      )

      .click(`.scrollable-area .media-list__container:nth-child(6)`)
      .click(`.close-btn`)

      .click(
        `xpath`,
        `//ul[@class="ml-auto navbar-nav"]//li[@class="dropdown nav-item"]//button[@class="dropdown-toggle btn btn-secondary"]`
      )
      .click(`.dropdown-menu .dropdown-item[href="/playlists"]`)

      .click(`xpath`, `//div[@class="media-list-item-d__title"][contains (text(), "__Test__Playlist")]`)
      .waitForElementWithText(`.media-header__title`, `__Test__Playlist`)
      .waitForElementWithText(`.media-header__sub-title`, `Free Trial Valid - Test User`)
      .waitForElementWithText(`.media-info__item-count`, `Items: 1`)
  },
  after: function (browser) {
    browser.end()
  }
}
