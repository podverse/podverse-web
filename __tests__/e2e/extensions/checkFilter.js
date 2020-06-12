module.exports.command = function (text) {

  this.click(`.not-showing.btn.btn-secondary`)
  this.sendKeys(`.form-control`, text)
  this.sendKeys(`.form-control`, this.Keys.ENTER)
  this.waitForXpathPresent(`//div[@class="media-list-item-a__title"][contains (text(), "${text}")]`)
  this.refresh()

  return this
}