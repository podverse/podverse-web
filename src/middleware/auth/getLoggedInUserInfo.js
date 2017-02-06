const errors = require('feathers-errors');
const {locator} = require('locator.js');

function getLoggedInUserInfo (req, res, next) {

  req.feathers = req.feathers || {};

  if (req.feathers.userId && req.feathers.userId.indexOf('auth0') === 0) {
    const UserService = locator.get('UserService');
    
    UserService.get(req.feathers.userId, { userId: req.feathers.userId })
      .then(user => {
        res.locals.loggedInName = user.name;
        res.locals.loggedInNickname = user.nickname;
        res.locals.isLoggedIn = true;
        next();
        return;
      })

  } else {
    res.locals.isLoggedIn = false;
    next();
    return;
  }

}

module.exports = {
  getLoggedInUserInfo
};
