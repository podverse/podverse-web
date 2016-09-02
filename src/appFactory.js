const
    path = require('path'),
    feathers = require('feathers'),
    rest = require('feathers-rest'),
    hooks = require('feathers-hooks'),
    bodyParser = require('body-parser'),
    {locator} = require('locator.js'),
    {processJWTIfExists} = require('middleware/auth/processJWTIfExists.js'),
    AuthService = new (require('services/auth/AuthService.js'))(),
    {parseFeed, saveParsedFeedToDatabase} = require('tasks/feedParser.js'),
    {nunjucks} = require('nunjucks.js'),
    {routes} = require('routes.js'),
    {errorHandler} = require('middleware/errors.js');

function appFactory () {

  const app = feathers();

  const Models = locator.get('Models');

  app
    .configure(rest())
    .configure(hooks())
    .configure(nunjucks)
    .configure(errorHandler)

    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use('/static/node_modules', feathers.static(path.resolve(__dirname, '../node_modules')))
    .use('/static', feathers.static(__dirname + '/static/libs'))

    .post('/auth/anonLogin', (req, res) => {
      AuthService.createAnonIdTokenAndUserId(req, res);
    })

    .use(processJWTIfExists)

    // Clip Detail Page
    .get('/clips/:id', (req, res) => {
      const ClipService = locator.get('ClipService');
      return ClipService.get(req.params.id)
        .then(mediaRef => {
          res.render('player.html', mediaRef.dataValues);
        }).catch(e => {
          res.sendStatus(404);
        });
    })

    .use('clips', locator.get('ClipService'))

    // Playlist Detail Page
    .get('/playlists/:id', (req, res) => {
      const PlaylistService = locator.get('PlaylistService');
      return PlaylistService.get(req.params.id)
        .then(playlist => {
          res.render('player.html', playlist.dataValues);
        }).catch(e => {
          res.sendStatus(404);
        });
    })

    .use('playlists', locator.get('PlaylistService'))

    .use('podcasts', locator.get('PodcastService'))

    .post('/parse', (req, res) => {
      if (req.body.rssURL) {
        parseFeed(req.body.rssURL)
          .then(parsedFeedObj => {
            saveParsedFeedToDatabase(parsedFeedObj);
          });
      } else {
        // TODO: how should we throw an error here? Do we need to use the errorHandler somehow?
        throw new errors.GeneralError('An RSS feed URL must be provided.');
      }
    })

    .configure(routes);

  return app;
}


module.exports = appFactory;
