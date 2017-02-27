const
    nJwt = require('njwt'),
    config = require('config.js'),
    errors = require('feathers-errors');



function processJWTIfExists (req, res, next) {

  req.feathers = req.feathers || {};

  let token = req.headers['authorization'];

  console.log('line-1 ', token);

  if (token == null) {
    let cookies = req.cookies;
    token = cookies.idToken;
  }

  console.log('line-2', token);

  if (token == null) {
    next();
    return;
  }

  console.log('line-3 ', token);

  try {
    console.log('config', config);
    const verifiedJwt = nJwt.verify(token, config.jwtSigningKey);
    req.feathers.userId = verifiedJwt.body.sub;
  } catch(e) {
    console.log(token);
    console.log(e);
    next();
    return;
  }

  next();
}

module.exports = {
  processJWTIfExists
};
