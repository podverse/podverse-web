// const { getTestOrigin, testLoginModal, testPageMetaTags, testSharedMetaTags } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (My-Profile Page)',
//     () => {

//         let page
//         beforeAll(async () => {
//             page = await global.__BROWSER__.newPage()
//             await page.goto(origin)
//         })

//         afterAll(async () => {
//             await page.close()
//             await page.waitFor(1000)
//         })

//         it('Login: Premium Valid', async () => {
//             await testLoginModal(page, "premium@stage.podverse.fm")
//         }, 10000)

//         it('loads the page', async () => {
//             await page.waitFor(500)
//             await page.goto(origin + '/my-profile')
//             await page.waitForXPath('//div[contains(text(), "Premium Valid - Test User")]')
//         }, 10000)

//         it('My-Profile Page: Shared Meta Tags', async () => {
//             await testSharedMetaTags(page)
//         })

//         it('My-Profile Page: Page Meta Tags', async () => {
//             await testPageMetaTags(page, `My Profile`, `My Podverse Profile. Subscribe to podcasts, playlists, and other profiles`)
//         })

//     }, 60000)