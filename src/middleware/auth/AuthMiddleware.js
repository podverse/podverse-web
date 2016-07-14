const
    njwt = require('njwt'),
    Cookies = require('Cookies'),
    config = require('config.js');

function checkIfAuthenticatedUser (req, res, next) {

  // Auth tokens only need to be checked when we're updating an existing item
  if (req.method !== 'PUT' && req.method !== 'PATCH') {
    next();
    return;
  }

  const token = returnMobileOrWebToken(req);

  if (typeof token === 'undefined') {
    res.sendStatus(401, 'Unauthorized');
  }

  const verifiedJwt = nJwt.verify(token, config.apiSecret);
  if (verifiedJwt === 'error: not authorized') {
    res.sendStatus(401);
  } else {
    req.feathers.token = token;
    req.feathers.user = verifiedJwt.body.sub;
    next();
  }

}

function returnMobileOrWebToken(req) {
  let token;

  if (req.headers['user-agent'] == 'Mobile App') {
    token = req.headers['x-auth-token'];
  } else {
    token = new Cookies(req, res).get('access_token');
  }

  return token;
}

module.exports = {
  checkIfAuthenticatedUser
};
