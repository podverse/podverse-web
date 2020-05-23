module.exports.command = function (elClass, close = 'button') {
  this.click(`.mp-header__${elClass}`)
  this.waitForElementVisible(`.${elClass}-modal`)
  if (close === 'clip') {
    this.click(`.make-clip-modal__cancel`)
  } else if (close === 'button') {
    this.click(`.close-btn`)
  }

  return this
}
  