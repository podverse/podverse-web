var app = require('./app.js'),
  config = require('./config.js');

app.listen(config.port, () => {
  console.log('Listening on port %s...', config.port);
});
