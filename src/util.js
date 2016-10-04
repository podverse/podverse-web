'use strict';

function isNonAnonUser (userId='') {
  return (userId.indexOf('auth0') === 0);
}

module.exports = {
  isNonAnonUser
}
