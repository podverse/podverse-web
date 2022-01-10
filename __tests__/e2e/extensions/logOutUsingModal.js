<<<<<<< HEAD
const { WEB_ORIGIN } = require('../constants')

module.exports.command = function () {
  this.click('div.horizontal-navbar-wrapper div.navbar-secondary__dropdown div.react-dropdown-select')
  this.pause(100)

  this.click('div.horizontal-navbar-wrapper div.navbar-secondary__dropdown .react-dropdown-select-item:nth-child(3)')
  this.pause(100)

  
  console.log('Logged Out')

  return this
}

=======
const { WEB_ORIGIN } = require('../constants')

module.exports.command = function () {
  this.click('.react-dropdown-select')
  this.pause(100)

  this.click('.react-dropdown-select-item:nth-child(4)')
  this.pause(100)

  console.log('Logged Out')

  return this
}
>>>>>>> aca26cff2202393972e23ba9efe1ce0f0b2662ab
