module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/')
    },
    'My-Profile': function (browser) {
        browser

            .loginUsingModal(`premium@stage.podverse.fm`)

            .url('https://stage.podverse.fm/my-profile')
            .waitForXpathPresent('//div[contains(text(), "Premium Valid - Test User")]')

            .testSharedMetaTags()
            .testPageMetaTags(
                `My Profile`,
                `My Podverse Profile. Subscribe to podcasts, playlists, and other profiles`
            )

            
    },
    after: function (browser) {
        browser.end()
    }
};