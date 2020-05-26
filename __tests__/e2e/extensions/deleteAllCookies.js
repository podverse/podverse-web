const { deleteAllCookies } = require('../utils')

module.exports.command = function () {
  this.execute(deleteAllCookies)

  return this
}
  