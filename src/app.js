const
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
    modelFactory = require('repositories/sequelize/models'),
    {locator} = require('locator.js');

const sqlEngine = new sqlEngineFactory({storage: 'podverse.sql'});
locator.set('Models', modelFactory(sqlEngine));

sqlEngine.sync();

const ClipService = require('services/clips/ClipService.js');
//const PlaylistService = require('services/playlists/PlaylistService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new ClipService()); // TODO: this shouldn't be ClipService...

module.exports = appFactory();
