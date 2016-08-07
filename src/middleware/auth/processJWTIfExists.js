const
    nJwt = require('njwt'),
    config = require('config.js'),
    errors = require('feathers-errors'),

    apiSecret = new Buffer(config.apiSecret, 'base64');



function processJWTIfExists (req, res, next) {

  req.feathers = req.feathers || {};

  let token = req.headers['authorization'];

  if (token == null) {
    next();
    return;
  }

  try {
    const verifiedJwt = nJwt.verify(token, apiSecret);
    req.feathers.userId = verifiedJwt.body.sub;
  } catch (e) {
    throw new errors.NotAuthenticated()
  }

  next();
}

module.exports = {
  processJWTIfExists
};
