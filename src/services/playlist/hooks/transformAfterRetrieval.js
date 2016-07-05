'use strict';

// src/services/playlist/hooks/transformAfterRetrieval.js
//
// Use this hook to manipulate incoming or outgoing data.
// For more information on hooks see: http://docs.feathersjs.com/hooks/readme.html

const defaults = {};

module.exports = function(options) {
  options = Object.assign({}, defaults, options);

  return function(hook) {
    hook.transformAfterRetrieval = true;
    let data = hook.result;
    // Add in URL
    let id = data._slug || data.id;
    hook.result.url = `${hook.app.get('baseURL')}/playlists/${id}`;

    return hook;
  };
};
