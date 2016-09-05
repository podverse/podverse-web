const
    errors = require('feathers-errors'),
    {locator} = require('locator.js'),
    {isClipMediaRef} = require('constants.js');

function routes () {
  const app = this;

  app.get('/', function (req, res) {
    const ClipService = locator.get('ClipService');
    const Models = locator.get('Models');
    const {Episode, Podcast} = Models;

    let params = {};
    params.sequelize = {
        limit: 20,
        include: [
          { model: Episode, include: [Podcast] }
        ],
        where: isClipMediaRef
    };

    return ClipService.find(params)
      .then(clips => {
        res.render('home.html', {clips: clips});
      })
      .catch(e => {
        console.log(e);
      });
  });

  app.get('/make-clip', function (req, res) {
    res.render('make-clip.html');
  })

}

module.exports = {routes};
