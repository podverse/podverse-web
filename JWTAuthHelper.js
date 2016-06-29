"use strict";

let
    nJwt = require('njwt'),
    config = require('./config.js'),
    Cookies = require('Cookies');

class JWTAuthHelper {

  createMobileOrWebJWT(req, res) {
    if (!this.verifyCredentials(req.body.username, req.body.password)) {
      res.send(401, "Wrong user or password");
      return;
    }

    let claims = {
      iss: 'http://localhost:9000', // for development
      // iss: 'https://podverse.fm', // for production
      sub: req.body.username, // unique user ID, do NOT use personally identifiable info like email
      scope: 'self, admins'
    };

    let jwt = nJwt.create(claims, config.apiSecret);
    jwt.setExpiration(new Date().setFullYear(new Date().getFullYear() + 1)); // One year from now
    let token = jwt.compact();

    if (req.headers['user-agent'] == 'Mobile App') {
      res.json({ token: token });
    } else {
      let cookieSettings = { httpOnly: true };
      // TODO: how should we add this secure cookie piece here for production?
      // app is not defined in this function.
      // if (app.get('env') === 'production') { // TODO: setup production value in NODE_ENV
      //   cookieSettings.secure = true;
      // }
      new Cookies(req, res).set('access_token', token, cookieSettings);

      res.redirect('secretAboutPage');
    }

  }

  verifyCredentials (username, password) {
    let combos = {
       "vince@example.com": 'free access',
       "creon@example.com": 'free access',
       "mitch@example.com": 'free access'
    };
    return (combos[username] === password);
  }

}



module.exports = JWTAuthHelper;
