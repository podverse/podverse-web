"use strict";

let nJwt = require('njwt'),
    Cookies = require('Cookies'),
    config = require('./config.js');

module.exports = function checkJWTAuth (req, res, next) {

  // Auth tokens only need to be checked when we're updating an existing item
  if (req.method !== 'PUT') {
    next();
    return
  }

  let token;

  if (req.headers['user-agent'] == 'Mobile App') {
    token = req.headers['x-auth-token'];
  } else {
    token = new Cookies(req, res).get('access_token');
  }

  if (typeof token !== 'undefined') {
    let verifiedJwt = nJwt.verify(token, config.apiSecret);
    if (verifiedJwt === 'error: not authorized') {
      res.send(401, "Error: Not authorized");
    } else {
      req.feathers.token = token;
      // req.token = verifiedJwt;
      next();
    }
  } else {
    res.send(401, "Error: Not authorized");
  }

};
