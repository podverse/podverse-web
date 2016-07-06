'use strict';
const playlist = require('./playlist');
const clip = require('./clip');
const authentication = require('./authentication');
const user = require('./user');

module.exports = function () {
  const app = this;

  app.configure(authentication);
  app.configure(user);
  app.configure(clip);
  app.configure(playlist);

};
