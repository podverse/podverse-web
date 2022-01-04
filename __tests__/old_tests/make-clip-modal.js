const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Make Clip Modal': function (browser) {
    browser

      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .click(`.more-dropdown-menu`)
      .click(`.media-list__right .dropdown-menu .dropdown-item`)

      .click(`.mp-header__make-clip`)

      .waitForXpathPresent(`//a[@href="/faq#why-do-some-clips-start-at-the-wrong-time"]`)
      .waitForXpathPresent(`//a[@href="/my-profile?type=clips"]`)

      .clearValue(`.form-control[name=make-clip-modal__start-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__start-time]`, `2:00`) //Start
      .sendKeys(`.form-control[name=make-clip-modal__end-time]`, `5:00`) //End
      .sendKeys(`.form-control[name=make-clip-modal__title]`, `Clip Title`) //Title

      .click(`.make-clip-modal__save`)

      .click(`.close-btn`)

      .clickDropdownToggleAndItem(`top - past week`, `most recent`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__title`, `Clip Title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-top-side`, `1/14/2020`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-top`, `Very Bad Wizards`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-middle-side`, `2:00 to 5:00`)
      .waitForElementWithText(
        `.media-list__container:nth-child(4) .media-list-item-a__sub-middle`,
        `Episode 180: Chekhov's Schrödinger's Dagger (Kurosawa's "Rashomon")`
      )

      .click(`.media-list__container:nth-child(4)`)

      .click(`.media-info-controls__edit.btn.btn-secondary`)

      .waitForElementPresent(`.form-control[name=make-clip-modal__start-time][value='2:00']`)
      .waitForElementPresent(`.form-control[name=make-clip-modal__end-time][value='5:00']`)
      .waitForElementWithText(`.form-control[name=make-clip-modal__title]`, `Clip Title`)

      .click(`.make-clip-modal__is-public button:nth-child(1)`)
      .click(`.make-clip-modal__is-public .dropdown-item:nth-child(1)`)
      .click(`.make-clip-modal__is-public button:nth-child(1)`)
      .click(`.make-clip-modal__is-public .dropdown-item:nth-child(1)`)

      .clearValue(`.form-control[name=make-clip-modal__start-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__start-time]`, `8:00`) //Start
      .clearValue(`.form-control[name=make-clip-modal__end-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__end-time]`, `10:00`) //End
      .clearValue(`.form-control[name=make-clip-modal__title]`)
      .sendKeys(`.form-control[name=make-clip-modal__title]`, `Clip Title - Edited`) //Title

      .click(`.make-clip-modal__save`)

      .url(`${WEB_ORIGIN}/`)

      .waitForElementWithText(`.media-list-item-a__title`, `Clip Title - Edited`)
      .waitForElementWithText(`.media-list-item-a__sub-middle-side`, `8:00 to 10:00`)
  },
  after: function (browser) {
    browser.end()
  }
}
