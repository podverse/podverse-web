module.exports.command = function (text, mediaTitleType = 'podcast') {

  if (mediaTitleType === 'podcast') {
    this.waitForXpathPresent(`//div[@class="mp-header-wrap__top"][contains (text(), "${text}")]`)
  } else if (mediaTitleType === 'episode') {
    this.waitForXpathPresent(`//div[@class="mp-header-wrap__bottom"][contains (text(), "${text}")]`)
  } 

  return this
}