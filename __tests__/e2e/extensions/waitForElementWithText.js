const timeoutOverride = process.env.TEST_TIMEOUT_OVERRIDE

module.exports.command = function (selector, text, timeout) {
  const finalTimeout = timeout && timeout > 0 ? timeout : timeoutOverride ? timeoutOverride : 5000
  this.expect.element(selector).text.to.contain(text).before(finalTimeout)

  return this
}
