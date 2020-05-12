module.exports.command = function (selector, xoffset = 0, yoffset = 0) {
  this.moveToElement('xpath', selector, xoffset, yoffset)

  return this
}
