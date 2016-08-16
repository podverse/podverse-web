const
    nJwt = require('njwt'),
    config = require('config.js'),
    uuid = require('uuid');

class AuthService {

  createAnonIdTokenAndUserId (req, res) {

    const userId = uuid.v1();

    const claims = {
      iss: 'http://localhost:8080',
      // iss: 'https://podverse.fm', // for production
      sub: userId
    };

    const jwt = nJwt.create(claims, config.jwtSigningKey);
    jwt.setExpiration(); // Never expire why not
    const token = jwt.compact();

    res.json({
      idToken: token,
      userId: userId
    });
  }

}

module.exports = AuthService;
