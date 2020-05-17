//         it('Home Page: Sort ► Most Recent', async () => {
//             await testDropdownItemSelect(page, "top - past week", "most recent")
//         })

//         it('Home Page: Sort ► Top Past Day', async () => {
//             await testDropdownItemSelect(page, "most recent", "top - past day")
//         })

//         it('Home Page: Sort ► Top Past Week', async () => {
//             await testDropdownItemSelect(page, "top - past day", "top - past week")
//         })

//         it('Home Page: Sort ► Top Past Month', async () => {
//             await testDropdownItemSelect(page, "top - past week", "top - past month")
//         })

//         it('Home Page: Sort ► Top Past Year', async () => {
//             await testDropdownItemSelect(page, "top - past month", "top - past year")
//         })

//         it('Home Page: Sort ► Top All Time', async () => {
//             await testDropdownItemSelect(page, "top - past year", "top - all time")
//         })

//         it('Home Page: Sort ► Random', async () => {
//             await testDropdownItemSelect(page, "top - all time", "random")
//         })


//     }, 60000)

const mediaListSelectsSelector = '.media-list__selects'

module.exports = {
    before: function (browser) {
        browser.url('https://stage.podverse.fm/')
    },
    'Home Page tests': function (browser) {
        browser
            .testSharedMetaTags()
            .testPageMetaTags(
                `Podverse - Create podcast highlights. Sync your podcasts across iOS, Android, and web. Open source technology.`,
                `Podcast app for iOS, Android, and web. Create and share podcast highlights and playlists. Sync your queue across all devices. Open source software.`
            )
            .waitForXpathPresent('//div[contains(text(), "Amet aliquam id diam maecenas ultricies mi eget.")]')

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem(`All Podcasts`, `Subscribed`)

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem(`Subscribed`, `All Podcasts`)

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem(`All Podcasts`, `Arts`)

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Arts", "Business")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Business", "Comedy")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Comedy", "Education")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Education", "Games & Hobbies")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Games & Hobbies", "Government & Organizations")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Government & Organizations", "Health")

            .scrollToSelector(mediaListSelectsSelector)
            .clickDropdownToggleAndItem("Health", "Music")
    },
    after: function (browser) {
        browser.end()
    }
};