const
    path = require('path'),
    feathers = require('feathers'),
    rest = require('feathers-rest'),
    hooks = require('feathers-hooks'),
    bodyParser = require('body-parser'),
    {locator} = require('locator.js'),
    {processJWTIfExists} = require('middleware/auth/processJWTIfExists.js'),
    AuthService = new (require('services/auth/AuthService.js'))(),
    {nunjucks} = require('nunjucks.js'),
    {routes} = require('routes.js'),
    {errorHandler} = require('middleware/errors.js'),
    errors = require('feathers-errors');

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

    .configure(routes);

  return app;
}


module.exports = appFactory;
