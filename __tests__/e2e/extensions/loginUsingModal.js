module.exports.command = function (email) {
  this.click('div.horizontal-navbar-wrapper div.navbar-secondary__dropdown div.react-dropdown-select')
  this.pause(100)

  this.click('div.horizontal-navbar-wrapper div.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(2)')
  this.pause(100)

  this.sendKeys('input[type="email"]', email)
  this.pause(100)

  this.sendKeys('input[type="password"]', 'Aa!1asdf')
  this.pause(100)

  this.click('.ReactModal__Content .submit-buttons .button-rectangle.primary')
  this.pause(100)
  console.log('Logged In')

  return this
}
