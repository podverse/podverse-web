'use strict';


const transformBeforeSave = require('./transformBeforeSave');
const transformAfterRetrieval = require('./transformAfterRetrieval');
const globalHooks = require('../../../hooks');
const hooks = require('feathers-hooks');


exports.before = {
  all: [],
  find: [],
  get: [],
  create: [transformBeforeSave()],
  update: [transformBeforeSave()],
  patch: [],
  remove: []
};

exports.after = {
  all: [],
  find: [transformAfterRetrieval()],
  get: [globalHooks.grabFirstItemFromArray(), transformAfterRetrieval()],
  create: [transformAfterRetrieval()],
  update: [transformAfterRetrieval()],
  patch: [],
  remove: []
};
