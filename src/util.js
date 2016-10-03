'use strict';

function isNonAnonUser (userId='') {
  console.log(userId, 'yo');
  return (userId.indexOf('auth0') === 0);
}

module.exports = {
  isNonAnonUser
}
