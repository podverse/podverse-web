'use strict';

const feathers = require('feathers');
const rest = require('feathers-rest');
const hooks = require('feathers-hooks');

const bodyParser = require('body-parser');

const {locator} = require('locator.js');
const {processJWTIfExists} = require('middleware/auth/processJWTIfExists.js');
const AuthService = new (require('services/auth/AuthService.js'))();
const {parseFeed} = require('tasks/feedParser.js')
const {nunjucks} = require('nunjucks.js');
const {routes} = require('routes.js');
const {errorHandler} = require('middleware/errors.js')

function appFactory () {

  const app = feathers();

  app
    .configure(rest())
    .configure(hooks())
    .configure(nunjucks)
    .configure(errorHandler)
    
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use(processJWTIfExists)

    .use('clips', locator.get('ClipService'))
    .use('playlists', locator.get('PlaylistService'))

    .get('/parse', (req, res) => {
      parseFeed('http://joeroganexp.joerogan.libsynpro.com/rss')
        .then(parsedFeedObj => {
          res.send(401, parsedFeedObj.podcast.title);
        });
    })

    .post('/auth', (req, res) => {
      AuthService.returnJWTInResponseIfValidUsernameAndPassword(req, res);
    })

    .configure(routes);

  return app;
}


module.exports = appFactory;
