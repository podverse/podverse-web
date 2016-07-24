const
    nJwt = require('njwt'),
    config = require('config.js');

function processJWTIfExists (req, res, next) {

  req.feathers = req.feathers || {};

  let token = req.headers['authorization'];

  if (token !== undefined) {
    try {
      const verifiedJwt = nJwt.verify(token, config.apiSecret);
      if (verifiedJwt === 'error: not authorized') {
        res.sendStatus(401);
      } else {
        req.feathers.userId = verifiedJwt.body.sub;
        next();
      }
    } catch (e) {
      res.sendStatus(401);
    }
  } else {
    next();
  }

}

module.exports = {
  processJWTIfExists
};
