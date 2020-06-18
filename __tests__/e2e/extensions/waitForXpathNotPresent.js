module.exports.command = function (selector, timeout) {
  this.waitForElementNotPresent({
    locateStrategy: 'xpath',
    selector,
  }, timeout)

  return this
}
