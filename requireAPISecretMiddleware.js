var config = require('./config.js');

module.exports = function requireAPISecret (req, res, next) {

  if(req.headers.authorization !== config.apiSecret) {
    res.sendStatus(401);
  } else {
    next();
  }

};
