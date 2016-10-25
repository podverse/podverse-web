'use strict';

// Used by the backend in middleware in routes.js
function isNonAnonUser (userId='') {
  return (userId.indexOf('auth0') === 0);
}

module.exports = {
  isNonAnonUser
}
