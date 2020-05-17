module.exports.command = function (selector, text, timeout = 5000) {
  this.expect.element(selector).text.to.contain(text).before(timeout)

  return this
}
