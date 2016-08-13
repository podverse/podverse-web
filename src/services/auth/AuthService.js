const
    nJwt = require('njwt'),
    config = require('config.js');

class AuthService {

  returnJWTInResponseIfValidUsernameAndPassword (req, res) {

    if (!this.verifyCredentials(req.body.username, req.body.password)) {
      res.status(401).send('Wrong user or password');
      return;
    }

    const token = this.createToken(req);
    res.json({ token: token });

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
      iss: 'http://localhost:8080',
      // iss: 'https://podverse.fm', // for production
      sub: req.body.username, // unique user ID, do NOT use personally identifiable info like email
      scope: 'self, admins'
    };

    const jwt = nJwt.create(claims, config.jwtSigningKey);
    jwt.setExpiration(new Date().setFullYear(new Date().getFullYear() + 1)); // Expires one year from now
    const token = jwt.compact();
    return token;
  }

}

module.exports = AuthService;
