"use strict";

let path = require('path');
let nedbFolder = require('./config.js').nedbFolder;

const
  Datastore = require('nedb'),

  clipsDb = new Datastore({
    filename: path.resolve(nedbFolder, 'clips.db'), autoload:true, timestampData: true
  });

module.exports = clipsDb;
