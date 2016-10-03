const
    errors = require('feathers-errors');

function verifyNonAnonUser (req, res, next) {

  req.feathers = req.feathers || {};

  if (req.feathers.userId && req.feathers.userId.indexOf('auth0') === 0) {
    next();
    return;
  }

  throw new errors.NotAuthenticated();
}

module.exports = {
  verifyNonAnonUser
};
