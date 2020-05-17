module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/settings')
    },
    'Settings Page': function (browser) {
        browser
            .testSharedMetaTags()
            .testPageMetaTags(
                'Podverse - Settings',
                'Customize your account settings on Podverse.'
            )
            .waitForElementWithText('h3', 'Interface')
    },
    after: function (browser) {
        browser.end()
    }
};
