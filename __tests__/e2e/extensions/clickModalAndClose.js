module.exports.command = function (buttonClass, modalClass, close = 'button') {
  
    this.click(`.mp-header__${buttonClass}`)
    this.waitForElementVisible(`.${modalClass}-modal`)
    if (close === 'clip') {
      this.click(`.make-clip-modal__cancel`)
    } else if (close === 'button') {
      this.click(`.close-btn`)
    }
  
    return this
  }
  