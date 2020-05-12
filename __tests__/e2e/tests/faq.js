module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/faq')
    },
    'About Page': function (browser) {
        browser
            .testSharedMetaTags()
            .testPageMetaTags(
                'Podverse - FAQ',
                'Podverse - Frequently asked questions'
            )
            .waitForElementWithText('h3', 'FAQ')
    },
    after: function (browser) {
        browser.end()
    }
};
