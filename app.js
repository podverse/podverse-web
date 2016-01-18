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

// app.use(express.static(__dirname + '/public'));
app.use('/bower_components', express.static(__dirname + '/bower_components'));
app.use('/libs', express.static(__dirname + '/libs'));
app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.render('index.html');
})

app.get('/c/:id', (req, res) => {

  clipRepository.getClip(req.params.id)
    .then(clip => {
      res.render('index.html', clip);
    })
    .catch(e => {
      res.sendStatus(404);
    });

});

app.post('/c', (req, res) => {
  clipRepository.createClip(req.body)
    .then(clipId => {
      res.status(201).send({clipUri: `/c/${clipId}`});
    })
    .catch(e => {
      res.status(500).send(e);
    })
});

app.get('/:page', function(req, res) {
  res.render(req.params.page);
});

app.listen(port);
console.log('Listening on port %s...', port);
