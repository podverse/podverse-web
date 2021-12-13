const { WEB_ORIGIN } = require('../constants')

module.exports.command = function () {
  this.click('.react-dropdown-select')
  this.pause(100)

  this.click('.react-dropdown-select-item:nth-child(4)')
  this.pause(100)

  
  console.log('Logged Out')

  return this
}

