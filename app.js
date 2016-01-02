var express   = require('express'),
    app       = express(),
    nunjucks  = require('nunjucks');

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

app.get('/', function(req, res) {
  res.render('index.html');
})

app.get('/:page', function(req, res) {
  res.render(req.params.page);
});

app.listen(port);
console.log('Listening on port %s...', port);
