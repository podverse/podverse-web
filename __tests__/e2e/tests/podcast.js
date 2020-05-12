// const { getTestOrigin, scrollIntoView, testDropdownItemSelect, testPageMetaTags, testSharedMetaTags } = require('../utility')
// const origin = getTestOrigin()

// describe(
//     '/ (Podcast Page)',
//     () => {

//         let page
//         beforeAll(async () => {
//             page = await global.__BROWSER__.newPage()
//             await page.goto(origin + '/podcast/Yqft_RG8j')
//         })

//         afterAll(async () => {
//             await page.close()
//             await page.waitFor(1000)
//         })

//         it('loads the page', async () => {
//             await page.waitForXPath('//span[contains(text(), "Very Bad Wizards")]')
//         }, 10000)

//         it('Podcast Page: Episodes ► Clips', async () => {
//             await testDropdownItemSelect(page, "Episodes", "Clips")
//         })

//         it('Podcast Page: Clips ► Episodes', async () => {
//             await testDropdownItemSelect(page, "Clips", "Episodes")
//         })

//         it('Podcast Page: Sort ► Most Recent', async () => {
//             await testDropdownItemSelect(page, "top - past week", "most recent")
//         })

//         it('Podcast Page: Sort ► Top Past Day', async () => {
//             await testDropdownItemSelect(page, "most recent", "top - past day")
//         })

//         it('Podcast Page: Sort ► Top Past Week', async () => {
//             await testDropdownItemSelect(page, "top - past day", "top - past week")
//         })

//         it('Podcast Page: Sort ► Top Past Month', async () => {
//             await testDropdownItemSelect(page, "top - past week", "top - past month")
//         }, 10000)

//         it('Podcast Page: Sort ► Top Past Year', async () => {
//             await testDropdownItemSelect(page, "top - past month", "top - past year")
//         }, 10000)

//         it('Podcast Page: Page 2 of Past Year', async () => {
//             await page.waitFor(2000)
//             await scrollIntoView(page, '.pagination')
//             const elements = await page.$x('//button[@class="page-link"][contains (text(), "2")]')
//             await elements[0].click();
//             await page.waitFor(2000)
//             await page.waitForXPath('//div[@class="media-list-item-a__title"][contains(text(), "Episode 123: What Chilling Effect? (Intelligence Pt. 2)")]')
//         }, 15000)

//         it('Podcast Page: Shared Meta Tags', async () => {
//             await testSharedMetaTags(page)
//         })

//         it('Podcast Page: Page Meta Tags', async () => {
//             await testPageMetaTags(page, `Very Bad Wizards`, `Very Bad Wizards is a podcast featuring a philosopher (Tamler Sommers) and a psychologist (David Pizarro), who share a love for ethics, pop culture, and cognitive science, and who have a marked inability to distinguish sacred from profane. Each podcast includes discussions of moral philosophy, recent work on moral psychology and neuroscience, and the overlap between the two.`)
//         })

//     }
// )