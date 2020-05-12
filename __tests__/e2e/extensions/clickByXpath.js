module.exports.command = function (selector) {
  this.click({
    locateStrategy: 'xpath',
    selector
  })

  return this
}
