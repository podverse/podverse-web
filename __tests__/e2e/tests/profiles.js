// const { getTestOrigin, testPageMetaTags, testSharedMetaTags } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (Profiles Page)',
//     () => {

//         let page
//         beforeAll(async () => {
//             page = await global.__BROWSER__.newPage()
//             await page.goto(origin + '/profiles')
//         })

//         afterAll(async () => {
//             await page.close()
//             await page.waitFor(1000)
//         })

//         it('loads the page', async () => {
//             await page.waitForXPath('//p[contains(text(), "You are not subscribed to any user profiles.")]')
//         }, 10000)

//         it('Profile Page: Shared Meta Tags', async () => {
//             await testSharedMetaTags(page)
//         })

//         it('Profile Page: Page Meta Tags', async () => {
//             await testPageMetaTags(page, `Profiles`, `My subscribed profiles on Podverse`)
//         })

//     }, 60000)