"use strict";

let feathers   = require('feathers'),
    bodyParser = require('body-parser'),
    nunjucks  = require('nunjucks'),

    config = require('./config.js'),
    attachRoutes = require('./routes.js'),
    playlistService=  require('./PlaylistService.js'),
    app = feathers();

app.configure(feathers.rest());
app.use(bodyParser.json());
nunjucks.configure(__dirname + '/templates', {
  autoescape: true,
  cache: false,
  express: app
});

app.use('/bower_components', feathers.static(__dirname + '/bower_components'));
app.use('/libs', feathers.static(__dirname + '/libs'));



attachRoutes(app);
app.use('pl', playlistService);

app.listen(config.port, () => {
  console.log('Listening on port %s...', config.port);
});
