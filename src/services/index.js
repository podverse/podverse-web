'use strict';
const playlist = require('./playlist');
const clip = require('./clip');
const authentication = require('./authentication');
const user = require('./user');

const path = require('path');
const fs = require('fs-extra');const Sequelize = require('sequelize');
module.exports = function() {
  const app = this;

  fs.ensureDirSync( path.dirname(app.get('sqlite')) );
  const sequelize = new Sequelize('feathers', null, null, {
    dialect: 'sqlite',
    storage: app.get('sqlite'),
    logging: false
  });
  app.set('sequelize', sequelize);

  app.configure(authentication);
  app.configure(user);
  app.configure(clip);
  app.configure(playlist);
};
