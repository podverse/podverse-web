module.exports.command = function (selector, timeout) {
  this.waitForElementPresent(
    {
      locateStrategy: 'xpath',
      selector
    },
    timeout
  )

  return this
}
