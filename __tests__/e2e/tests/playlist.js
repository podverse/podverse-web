// const { getTestOrigin, testLoginModal, testPageMetaTags, testSharedMetaTags } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (Playlist Page)',
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
//             await page.goto(origin + '/playlist/-67KgiG1')
//             await page.waitForXPath('//div[contains(text(), "Diam quis enim lobortis scelerisque fermentum dui faucibus.")]')
//         }, 10000)

//         it('Playlist Page: Shared Meta Tags', async () => {
//             await testSharedMetaTags(page)
//         })

//         it('Playlist Page: Page Meta Tags', async () => {
//             await testPageMetaTags(page, `Test Playlist 1`, `Test Playlist 1 - playlist on Podverse `)
//         })

//     }, 60000)