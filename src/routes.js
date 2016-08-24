const
    errors = require('feathers-errors'),
    {locator} = require('locator.js');

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
        where: {
          $and: {
            $not: {
              startTime: 0
            },
            $not: {
              endTime: ''
            }
          }
        }
    };

    return ClipService.find(params)
      .then(clips => {
        res.render('home.html', {clips: clips});
      })
      .catch(e => {
        console.log(e);
      });
  });

}

module.exports = {routes};
