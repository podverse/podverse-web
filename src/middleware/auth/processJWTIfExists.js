const
    nJwt = require('njwt'),
    config = require('config.js'),
    errors = require('feathers-errors');



function processJWTIfExists (req, res, next) {

  req.feathers = req.feathers || {};

  let token = req.headers['authorization'];

  if (token == null) {
    let cookies = req.cookies;
    token = cookies.idToken;
  }

  if (token == null) {
    next();
    return;
  }

  const verifiedJwt = nJwt.verify(token, config.jwtSigningKey);
  req.feathers.userId = verifiedJwt.body.sub;

  next();
}

module.exports = {
  processJWTIfExists
};
