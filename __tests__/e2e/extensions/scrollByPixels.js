module.exports.command = function (x = 0, y = 0) {
  this.execute(`document.querySelector('.view__contents').scrollBy(${x}, ${y})`)

  return this
}
