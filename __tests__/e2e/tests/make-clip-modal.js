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

      .clearValue(`.form-control`)
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
  },
  after: function (browser) {
      browser.end()
  }
}
