'use strict';

const transformBeforeSave = require('./transformBeforeSave');
const transformAfterRetrieval = require('./transformAfterRetrieval');

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
  get: [transformAfterRetrieval()],
  create: [transformAfterRetrieval()],
  update: [transformAfterRetrieval()],
  patch: [],
  remove: []
};
