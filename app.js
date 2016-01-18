"use strict";

var express   = require('express'),
    bodyParser = require('body-parser'),
    app       = express(),
    nunjucks  = require('nunjucks'),
    clipRepository = new (require('./ClipRepository.js'))();

var port = process.env.PORT || 9000;

var _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/templates' : 'templates' ;

nunjucks.configure(_templates, {
  autoescape: true,
  cache: false,
  express: app
});

app.engine('html', nunjucks.render);
app.set('view engine', 'html');

app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/libs', express.static(__dirname + '/libs'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index.html');
})

// View a clip
app.get('/c/:id', (req, res) => {

  clipRepository.getClip(req.params.id)
    .then(clip => {
      res.render('index.html', clip);
    })
    .catch(e => {
      console.error(e);
      res.sendStatus(404);
    });
});

// Create a clip
app.post('/c', (req, res) => {

  let clip = req.body;

  clipRepository.createClip(clip)
    .then(clipId => {

      // Send the URI of the clip back somehow
      let result = {
        clipUri: `/c/${clipId}`
      }

      res.status(201).send(result);
    })
    .catch(e => {
      res.status(500).send(e);
    })
});

app.listen(port);
console.log('Listening on port %s...', port);
