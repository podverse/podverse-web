const
    nJwt = require('njwt'),
    config = require('config.js'),
    errors = require('feathers-errors');



function processJWTIfExists (req, res, next) {

  req.feathers = req.feathers || {};

  let token = req.headers['authorization'];

  if (token == null) {
    next();
    return;
  }

  try {
    const verifiedJwt = nJwt.verify(token, config.jwtSigningKey);
    req.feathers.userId = verifiedJwt.body.sub;
  } catch (e) {
    throw new errors.NotAuthenticated();
  }

  next();
}

module.exports = {
  processJWTIfExists
};
