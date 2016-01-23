"use strict";

let express   = require('express'),
    bodyParser = require('body-parser'),
    nunjucks  = require('nunjucks'),

    config = require('./config.js'),
    attachRoutes = require('./routes.js'),

    app = express();

nunjucks.configure(__dirname + '/templates', {
  autoescape: true,
  cache: false,
  express: app
});

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/libs', express.static(__dirname + '/libs'));
app.use(bodyParser.json());

attachRoutes(app);

app.listen(config.port, () => {
  console.log('Listening on port %s...', config.port);
});
