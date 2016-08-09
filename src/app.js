const
    appFactory = require('./appFactory'),
    sqlEngineFactory = require('repositories/sequelize/engineFactory.js'),
    modelFactory = require('repositories/sequelize/models'),
    {locator} = require('locator.js');

const sqlEngine = new sqlEngineFactory({storage: 'podverse.sql'});
locator.set('Models', modelFactory(sqlEngine));

sqlEngine.sync();

const ClipService = require('services/clip/ClipService.js');
const PlaylistService = require('services/playlist/PlaylistService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
module.exports = appFactory();
