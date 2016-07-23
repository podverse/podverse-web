'use strict';

const {locator} = require('locator.js');

const appFactory = require('./appFactory');
const sqlEngineFactory = require('repositories/sequelize/engineFactory.js');
const modelFactory = require('repositories/sequelize/models');

const sqlEngine = new sqlEngineFactory({storage: 'podverse.sql'});
locator.set('Models', modelFactory(sqlEngine));
sqlEngine.sync();


const ClipService = require('services/clips/ClipService.js');
//const PlaylistService = require('services/playlists/PlaylistService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new ClipService());

module.exports = appFactory();
