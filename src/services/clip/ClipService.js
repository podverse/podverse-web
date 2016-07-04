'use strict';

const service = require('feathers-sequelize').Service;
const errors = require('feathers-errors').default;
const configuration = require('feathers-configuration');

class ClipService extends service {
  // TODO: how can we retrieve by both _slug $or id?
  // I want this to be a findOne, but as far as I could see that is apparently
  // not an option with feathers-sequelize. To work around this, I implemented
  // the global before hook grabFirstItemFromArray :(
  get(id) {
    return super.get(id);
  }

  // find(params [, callback]) {}

  // TODO: make sure user cannot override someone else's primary id with a slug that
  // matches that id. Make sure playlists with the same _slugs cannot exist.
  update(id, data, params) {

    // TODO: is this delete data._id line still needed?
    // Don't use whatever id is being sent in the payload.
    // delete data._id;

    // Make sure the data _slug reflects the playlist we're posting.
    // data._slug = id;

    return super.update(id, data, params);

  }
  // patch(id, data, params [, callback]) {}
  // remove(id, params [, callback]) {}
  // setup(app, path) {}
}

module.exports = ClipService;
