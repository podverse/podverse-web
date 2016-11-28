const
    nJwt = require('njwt'),
    {baseURL, jwtSigningKey} = require('config.js'),
    uuid = require('uuid');

class AuthService {

  createAnonIdTokenAndUserId (req, res) {

    const userId = uuid.v1();

    const claims = {
      iss: baseURL,
      sub: userId
    };

    const jwt = nJwt.create(claims, jwtSigningKey);
    jwt.setExpiration(); // Never expire why not
    const token = jwt.compact();

    res.json({
      idToken: token,
      userId: userId
    });

  }

}

module.exports = AuthService;
