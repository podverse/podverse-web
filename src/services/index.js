'use strict';

const authentication = require('./authentication');
const user = require('./user');
const clip = require('./clip');
const playlist = require('./playlist');

module.exports = function () {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(clip);
  app.configure(playlist);

};
