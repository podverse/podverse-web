module.exports.command = function (text, mediaTitleType = 'podcast') {

  if (mediaTitleType === 'podcast') {
    this.waitForXpathPresent(`//div[@class="media-list-item-a__sub-top "][contains (text(), "${text}")]`)
  } else if (mediaTitleType === 'episode') {
    this.waitForXpathPresent(`//div[@class="media-list-item-a__title"][contains (text(), "${text}")]`)
  } else if (mediaTitleType === 'link') {
    this.waitForXpathPresent(`//a[@class="media-info__episode-title"][contains (text(), "${text}")]`)
  }
  return this
}