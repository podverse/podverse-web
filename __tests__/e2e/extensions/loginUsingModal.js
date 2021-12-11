module.exports.command = function (email) {
  this.click('.react-dropdown-select')
  this.pause(100)

  this.click('.react-dropdown-select-item:nth-child(3)')
  this.pause(100)

  this.sendKeys('div.login-modal div.text-input:nth-child(3) input', email)
  this.pause(100)

  this.sendKeys('div.login-modal div.text-input:nth-child(4) input', 'Aa!1asdf')
  this.pause(100)

  this.click('div.login-modal button.button-rectangle.primary')
  this.pause(100)
  console.log('Logged In')

  return this
}
