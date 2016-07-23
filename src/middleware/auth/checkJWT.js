function checkJWT (req, res, next) {
  req.feathers = req.feathers || {};

  req.feathers.userId = 'freeeee';

  next();
}

module.exports = {
  checkJWT
};
