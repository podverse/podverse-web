const { WEB_ORIGIN } = require('../constants')

module.exports.command = function () {
  this.click('.navbar .dropdown.nav-item:nth-child(3)')
  this.pause(500)

  this.click('.navbar .dropdown.nav-item:nth-child(3) .dropdown-item:nth-child(3)')
  this.pause(500)
  
  console.log('Logged Out')

  return this
}

