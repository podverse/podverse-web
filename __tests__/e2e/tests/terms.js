module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/terms')
    },
    'Terms Page': function (browser) {
        browser
            .testSharedMetaTags()
            .testPageMetaTags(
                'Podverse - Terms of Service',
                'Podverse terms of service agreement.'
            )
            .waitForElementWithText('h3', 'Terms of Service')
    },
    after: function (browser) {
        browser.end()
    }
};
