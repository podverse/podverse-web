'use strict';

const
    nJwt = require('njwt'),
    config = require('config.js'),
    Cookies = require('Cookies');

class AuthService {

  returnJWTInResponseIfValidUsernameAndPassword (req, res) {

    if (!this.verifyCredentials(req.body.username, req.body.password)) {
      res.status(401).send('Wrong user or password');
      return;
    }

    const token = this.createToken(req);

    if (req.headers['user-agent'] === 'Mobile App') {
      res.json({ token: token });
    } else {
      // TODO: add secure cookie handling for production
      const cookieSettings = { httpOnly: true };
      new Cookies(req, res).set('access_token', token, cookieSettings);
      res.sendStatus(200);
    }

  }

  verifyCredentials(username, password) {
    if (!username || !password) { return false }

    const combos = {
      'moe@podverse.fm': 'free access',
      'larry@podverse.fm': 'free access',
      'curly@podverse.fm': 'free access'
    };
    return (combos[username] === password);
  }

  createToken(req) {
    const claims = {
      iss: 'http://localhost:9000',
      // iss: 'https://podverse.fm', // for production
      sub: req.body.username, // unique user ID, do NOT use personally identifiable info like email
      scope: 'self, admins'
    };

    const jwt = nJwt.create(claims, config.apiSecret);
    jwt.setExpiration(new Date().setFullYear(new Date().getFullYear() + 1)); // Expires one year from now
    const token = jwt.compact();
    return token;
  }

}

module.exports = AuthService;
