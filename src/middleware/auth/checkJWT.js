


function checkJWT (req, res, next) {
  req.feathers.userId = 'freeeee'
  next();
}

module.exports = {
  checkJWT
}
