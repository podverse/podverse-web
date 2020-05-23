module.exports.command = function (email) {
  this.click('.hide-mobile:nth-child(5) a')
  this.waitForElementWithText('.login-modal h3', 'Login')
  this.pause(500)

  this.sendKeys('.form-control[name=login-modal__email]', email)
  this.pause(500)

  this.sendKeys('.form-control[name=login-modal__password]', 'Aa!1asdf')
  this.pause(500)

  this.click('.login-modal-btns-right__login.btn.btn-primary')
  this.pause(500)

  return this
}
