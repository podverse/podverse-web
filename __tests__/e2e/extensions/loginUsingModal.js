module.exports.command = function (email) {
  this.click('.navbar .dropdown.nav-item:nth-child(3)')
  this.pause(500)

  this.click('.navbar .dropdown.nav-item:nth-child(3) .dropdown-item:nth-child(3)')
  this.pause(500)

  this.sendKeys('.form-control[name=login-modal__email]', email)
  this.pause(500)

  this.sendKeys('.form-control[name=login-modal__password]', 'Aa!1asdf')
  this.pause(500)

  this.click('.login-modal-btns-right__login.btn.btn-primary')
  this.pause(500)
  console.log('Logged In')

  return this
}
