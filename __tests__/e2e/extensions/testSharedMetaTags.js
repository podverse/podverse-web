/* eslint-disable no-unused-expressions */

module.exports.command = function () {
  this.expect.element('meta[name="twitter:site"][content="@podverse"]').to.be.present
  this.expect.element('meta[name="twitter:site:id"][content="2555941009"]').to.be.present
  this.expect.element('meta[name="twitter:creator"][content="@podverse"]').to.be.present
  this.expect.element('meta[name="twitter:creator:id"][content="2555941009"]').to.be.present
  this.expect.element('meta[name="twitter:app:name:iphone"][content="Podverse"]').to.be.present
  this.expect.element('meta[name="twitter:app:id:iphone"][content="1390888454"]').to.be.present
  this.expect.element('meta[name="twitter:site"][content="@podverse"]').to.be.present
  this.expect.element('meta[name="twitter:card"][content="summary_large_image"]').to.be.present

  return this
}
