const
    path = require('path'),
    feathers = require('feathers'),
    rest = require('feathers-rest'),
    hooks = require('feathers-hooks'),
    bodyParser = require('body-parser'),
    cookieParser = require('cookie-parser'),
    {locator} = require('./locator'),
    {processJWTIfExists} = require('./middleware/auth/processJWTIfExists'),
    {nunjucks} = require('./nunjucks'),
    {routes} = require('./routes'),
    {errorHandler} = require('./middleware/errors'),
    errors = require('feathers-errors');

function appFactory () {

  const app = feathers();

  const Models = locator.get('Models');

  app
    .configure(rest())
    .configure(hooks())
    .configure(nunjucks)
    .configure(errorHandler)

    .use(cookieParser())
    .use(bodyParser.json())
    .use(bodyParser.urlencoded({ extended: true }))

    .use('/static/node_modules', feathers.static(path.resolve(__dirname, '../node_modules')))
    .use('/static', feathers.static(__dirname + '/static/libs'))

    .use(processJWTIfExists)

    .configure(routes);

  return app;
}


module.exports = appFactory;
