'use strict';

// src/services/playlist/hooks/transformBeforeSave.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const uuid = require('uuid');

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.transformBeforeSave = true;

    let data = hook.data;

    delete data.url;

    data._slug = data._slug || uuid.v4();
    // data.items = data.items || [];

    return hook;
  };
};
