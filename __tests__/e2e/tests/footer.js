module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/')
    },
    'Footer': function (browser) {
        browser
            .waitForXpathPresent(`//a[contains(text(), 'Podverse')]`)
            .waitForXpathPresent(`//html[@data-theme="dark"]`)
            .scrollToSelector(`.react-switch-handle`, 'down')
            .click(`.react-switch-handle`)
            .waitForXpathPresent(`//html[@data-theme="light"]`)
            .waitForXpathPresent(`//a[@href="https://goo.gl/forms/BK9WPAsK1q6xD4Xw1"]`)
            .waitForXpathPresent(`//a[@href="https://www.gnu.org/licenses/agpl-3.0.en.html"]`)
            .waitForXpathPresent(`//a[@href="https://reddit.com/r/podverse"]`)
            .waitForXpathPresent(`//a[@href="https://twitter.com/podverse"]`)
            .waitForXpathPresent(`//a[@href="https://facebook.com/podverse"]`)
            .waitForXpathPresent(`//a[@href="https://github.com/podverse"]`)
            
    },
    after: function (browser) {
        browser.end()
    }
};
