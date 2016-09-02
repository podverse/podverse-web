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
const PodcastService = require('services/podcast/PodcastService.js');

locator.set('ClipService', new ClipService());
locator.set('PlaylistService', new PlaylistService());
locator.set('PodcastService', new PodcastService());
module.exports = appFactory();
