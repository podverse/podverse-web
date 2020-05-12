

//         it('Contact Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://goo.gl/forms/BK9WPAsK1q6xD4Xw1"]')
//         })

//         it('Open Source Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://www.gnu.org/licenses/agpl-3.0.en.html"]')
//         })

//         it('Social Media: Reddit Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://reddit.com/r/podverse"]')
//         })

//         it('Social Media: Twitter Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://twitter.com/podverse"]')
//         })

//         it('Social Media: Facebook Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://facebook.com/podverse"]')
//         })

//         it('Social Media: Github Button Loads Properly', async () => {
//             await page.waitForXPath('//a[@href="https://github.com/podverse"]')
//         })

//     })

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
    },
    after: function (browser) {
        browser.end()
    }
};
