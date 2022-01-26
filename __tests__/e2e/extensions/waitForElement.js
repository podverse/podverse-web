const timeoutOverride = process.env.TEST_TIMEOUT_OVERRIDE

module.exports.command = function (selector, timeout) {
  const finalTimeout = timeout && timeout > 0 ? timeout : timeoutOverride ? timeoutOverride : 5000
  this.expect.element(selector).to.be.present.before(finalTimeout)

  return this
}
