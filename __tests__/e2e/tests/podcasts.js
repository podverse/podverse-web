// const { getTestOrigin, testPageMetaTags, testSharedMetaTags } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (Podcasts Page)',
//     () => {

//         let page
//         beforeAll(async () => {
//             page = await global.__BROWSER__.newPage()
//             await page.goto(origin + '/podcasts')
//         })

//         afterAll(async () => {
//             await page.close()
//             await page.waitFor(1000)
//         })

//         it('loads the page', async () => {
//             await page.waitForXPath('//div[contains(text(), "The Joe Rogan Experience")]')
//         }, 10000)

//         it('Podcasts Page: Shared Meta Tags', async () => {
//             await testSharedMetaTags(page)
//         })

//         it('Podcasts Page: Page Meta Tags', async () => {
//             await testPageMetaTags(page, `Podcasts`, `Find and subscribe to podcasts.`)
//         })

//     }, 60000)