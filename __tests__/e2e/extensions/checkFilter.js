module.exports.command = function (text) {

  this.click(`.header-nav-tabs__advanced-btn `)
  this.sendKeys(`.form-control`, text)
  this.sendKeys(`.form-control`, this.Keys.ENTER)
  this.waitForXpathPresent(`//div[@class="media-list-item-a__title"][contains (text(), "${text}")]`)
  this.refresh()

  return this
}