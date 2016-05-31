"use strict";

let path = require('path');
let nedbFolder = require('../config.js').nedbFolder;

const NeDB = require('nedb');

module.exports = new NeDB({
  filename: path.resolve(nedbFolder, 'playlists.db'),
  autoload: true
});
