'use strict';

const appFactory = require('./appFactory.js');
const app = appFactory();
const port = app.get('port');
const server = app.listen(port);

server.on('listening', () =>
  console.log(`Feathers application started on ${app.get('host')}:${port}`)
);
