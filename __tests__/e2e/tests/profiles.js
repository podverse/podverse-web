module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/')
    },
    'Profiles Tests': function (browser) {
        browser
            .url('https://stage.podverse.fm/profiles')
            .waitForElementWithText('p', 'You are not subscribed to any user profiles.')

            .testSharedMetaTags()
            .testPageMetaTags(
                `Profiles`,
                `My subscribed profiles on Podverse`
            )


    },
    after: function (browser) {
        browser.end()
    }
};