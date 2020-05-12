const searchInput = `.search__input`

module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/search')
    },
    'Search Page': function (browser) {
        browser
            .testSharedMetaTags()
            .testPageMetaTags(
                'Podverse - Search',
                'Search for podcasts by title or host on Podverse.'
            )
            .waitForXpathPresent(`//h3[contains(text(), "Search")]`)

            .sendKeys(searchInput, `The Joe Rogan Experience`)
            .click(`.search__input-btn`)
            .pause(500)
            .waitForXpathPresent(`//div[@class="media-list-item-b__title"][contains (text(), "The Joe Rogan Experience")]`)

            .clearValue(searchInput)

            .sendKeys(searchInput, `Very Bad Wizards`)
            .sendKeys(searchInput, browser.Keys.ENTER)
            .pause(500)
            .waitForXpathPresent(`//div[@class="media-list-item-b__title"][contains (text(), "Very Bad Wizards")]`)

            .click(`.media-list__item `)
            .waitForXpathPresent(`//div[@class="media-header__sub-title"][contains (text(), "Tamler Sommers & David Pizarro")]`)

            .url('https://stage.podverse.fm/search')

            .click(`.search-by__host`)
            .sendKeys(searchInput, `Joe Rogan`)
            .click(`.search__input-btn`)
            .pause(500)
            .waitForXpathPresent(`//div[@class="media-list-item-b__title"][contains (text(), "The Joe Rogan Experience")]`)

            .clearValue(searchInput)

            .sendKeys(searchInput, `Tamler Sommers`)
            .sendKeys(searchInput, browser.Keys.ENTER)
            .pause(500)
            .waitForXpathPresent(`//div[@class="media-list-item-b__title"][contains (text(), "Very Bad Wizards")]`)

            .waitForXpathPresent(`//a[@href="https://docs.google.com/forms/d/e/1FAIpQLSdewKP-YrE8zGjDPrkmoJEwCxPl_gizEkmzAlTYsiWAuAk1Ng/viewform?usp=sf_link"]`)

    },
    after: function (browser) {
        browser.end()
    }
};
