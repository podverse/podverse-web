
function routes () {
  const app = this;

  app.get('/', function (req, res) {
    res.render('home.html')
  });
}

module.exports = {routes};
