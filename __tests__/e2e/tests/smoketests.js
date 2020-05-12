// // import expectPuppeteer from 'expect-puppeteer'

// const { getTestOrigin, scrollIntoView } = require('../utility')
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
//             '/ (Pages)',
//             () => {

//                 it('Load Homepage', async () => {
//                     await page.goto(origin)
//                     await page.waitForXPath("//a[contains(text(), 'Podverse')]")
//                 }, 40000)

//                 it('About Page: footer link', async () => {
//                     await page.click('.footer-bottom__link[href="/about"]')
//                     await page.waitForXPath("//h3[contains(text(), 'About')]")
//                 }, 10000)

//                 it('Terms Page: footer link', async () => {
//                     await page.click('.footer-bottom__link[href="/terms"]')
//                     await page.waitForXPath("//h3[contains(text(), 'Terms of Service')]")
//                 }, 10000)

//                 it('Premium Page: footer link', async () => {
//                     await page.click('.footer-bottom__link[href="/membership"]')
//                     await page.waitForXPath("//h3[contains(text(), 'Premium')]")
//                 }, 10000)

//                 it('Search Page: magnifying glass link', async () => {
//                     const elements = await page.$x('//li[@class="hide-mobile nav-item"]//a[@class="nav-link"][@href="/search"]')
//                     await elements[0].click();
//                     await page.waitForXPath("//h3[contains(text(), 'Search')]")
//                     await page.focus('.search__input')
//                     await page.keyboard.type('Very Bad Wizards')
//                     await page.click('.search__input-btn')
//                 }, 10000)

//                 it('Podcasts Page: header link', async () => {
//                     await page.click('.nav-link[href="/podcasts"]')
//                     await page.waitForXPath("//h3[contains(text(), 'Podcasts')]")
//                 }, 10000)

//                 it('Settings Page: dropdown ► settings link', async () => {
//                     await page.click('.dropdown-toggle')
//                     await page.click('.dropdown-item[href="/settings"]')
//                     await page.waitForXPath("//h3[contains(text(), 'Interface')]")
//                 }, 10000)
//             }, 60000)



//     },
//     20000
// )

