// // import expectPuppeteer from 'expect-puppeteer'

// const { getTestOrigin } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (Smoke Tests)',
//     () => {

//         let page
//         beforeAll(async () => {
//             page = await global.__BROWSER__.newPage()
//         })

//         afterAll(async () => {
//             await page.close()
//             await page.waitFor(1000)
//         })

//         describe(
//             '/ (Modals)',
//             () => {

//                 it('Load Homepage', async () => {
//                     await page.goto(origin)
//                     await page.waitForXPath("//a[contains(text(), 'Podverse')]")
//                 }, 40000)

//                 it('Login Modal: header link', async () => {
//                     const elements = await page.$x('//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][contains (text(), "Login")]')
//                     await elements[0].click();
//                     await page.waitForXPath("//h3[contains(text(), 'Login')]")
//                 })

//                 it('Sign Up Modal: login modal link', async () => {
//                     await page.click('.login-modal__sign-up')
//                     await page.waitForXPath("//h3[contains(text(), 'Sign Up')]")
//                     await page.click('.close-btn')
//                 })

//                 it('Forgot? Modal: login modal link', async () => {
//                     const elements = await page.$x('//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][contains (text(), "Login")]')
//                     await elements[0].click();
//                     await page.click('.login-modal__forgot')
//                     await page.waitForXPath("//h3[contains(text(), 'Forgot Password')]")
//                     await page.click('.close-btn')
//                 })

//                 it('Queue Modal: media bar link', async () => {
//                     await page.click('.mp-header__queue')
//                     await page.waitForXPath("//h3[contains(text(), 'Queue')]")
//                     await page.click('.close-btn')
//                 })


//                 it('Clip Modal: media bar link', async () => {
//                     await page.click('.mp-header__clip')
//                     await page.waitForXPath("//h3[contains(text(), 'Make Clip')]")
//                     await page.click('.make-clip-modal__cancel')
//                 })

//                 it('Add To Modal: media bar link', async () => {
//                     await page.click('.mp-header__add')
//                     await page.waitForXPath("//h3[contains(text(), 'Add To')]")
//                     await page.click('.close-btn')
//                 })

//                 it('Share Modal: media bar link', async () => {
//                     await page.click('.mp-header__share')
//                     await page.waitForXPath("//h3[contains(text(), 'Share')]")
//                     await page.click('.close-btn')
//                 })

//             }, 60000)

//     },
//     20000
// )

