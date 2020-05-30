const { WEB_ORIGIN } = require('../constants')

module.exports = {
  before: function (browser) {
    browser.url(`${WEB_ORIGIN}/`)
  },
  'Modals': function (browser) {
    browser

      .loginUsingModal('freetrial@stage.podverse.fm')
      .waitForXpathPresent(`//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]`)

      .click(`.mp-header__make-clip`)

      .waitForXpathPresent(`//a[@href="/faq#why-do-some-clips-start-at-the-wrong-time"]`)
      .waitForXpathPresent(`//a[@href="/my-profile?type=clips"]`)

      .waitForXpathPresent(`//button[contains(text(), 'Public')]`)

      .clearValue(`.form-control[name=make-clip-modal__start-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__start-time]`, `2:00`) //Start
      .sendKeys(`.form-control[name=make-clip-modal__end-time]`, `5:00`) //End
      .sendKeys(`.form-control[name=make-clip-modal__title]`, `Clip Title`) //Title

      .click(`.make-clip-modal__save`)

      .waitForXpathPresent(`//h3[contains(text(), 'Share Clip')]`)

      .click(`.close-btn`)

      .click(`xpath`, `//a[@class="nav-link"][@href="/clips"]`)

      .waitForElementWithText(`.transparent.dropdown-toggle.btn.btn-secondary`, 'Subscribed')

      .clickDropdownToggleAndItem(`top - past week`, `most recent`)

      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__title`, `Clip Title`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-top-side`, `1/14/2020`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-top`, `Very Bad Wizards`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-middle-side`, `2:00 to 5:00`)
      .waitForElementWithText(`.media-list__container:nth-child(4) .media-list-item-a__sub-middle`, `Episode 180: Chekhov's Schrödinger's Dagger (Kurosawa's "Rashomon")`)

      .click(`.media-list__container:nth-child(4)`)

      .click(`.media-info-controls__edit.btn.btn-secondary`)

      .waitForXpathPresent(`//button[contains(text(), 'Public')]`)
      .waitForElementPresent(`.form-control[name=make-clip-modal__start-time][value='2:00']`)
      .waitForElementPresent(`.form-control[name=make-clip-modal__end-time][value='5:00']`)
      .waitForElementWithText(`.form-control[name=make-clip-modal__title]`, `Clip Title`)

      .click('xpath', `//button[@class="dropdown-toggle btn btn-secondary"][contains (text(), "Public")]`)
      .click('xpath', `//button[@class="dropdown-item"][contains (text(), "Only with link")]`)
      .clearValue(`.form-control[name=make-clip-modal__start-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__start-time]`, `8:00`) //Start
      .clearValue(`.form-control[name=make-clip-modal__end-time]`)
      .sendKeys(`.form-control[name=make-clip-modal__end-time]`, `10:00`) //End
      .clearValue(`.form-control[name=make-clip-modal__title]`)
      .sendKeys(`.form-control[name=make-clip-modal__title]`, `Clip Title - Edited`) //Title

      .click(`.make-clip-modal__save`)

      .url(`${WEB_ORIGIN}/my-profile?type=clips`)

      .waitForElementWithText(`.media-list .media-list__container:nth-child(1) .media-list-item-a__title`, `Clip Title - Edited`)
      .waitForElementWithText(`.media-list .media-list__container:nth-child(1) .media-list-item-a__sub-middle-side`, `8:00 to 10:00`)

  },
  after: function (browser) {
    browser.end()
  }
}
