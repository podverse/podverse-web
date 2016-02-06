"use strict";

let NeDB = require('nedb'),
  NeDBService = require('feathers-nedb').Service,
  errors = require('feathers-errors').default,
  _ = require('lodash'),
  config = require('./config.js'),
  uuid = require('uuid');

class PlaylistService extends NeDBService {

  _assertModel (data) {

    // Add in URL
    let id = data._slug || data._id;
    data.url = `${config.baseURL}/pl/${id}`;

    // assert items
    data.items = data.items || [];

    return data;
  }

  get (id) {
    return new Promise((resolve, reject) => {

      this.Model.findOne({$or: [{_id:id},{_slug:id}]}, (err, playlist) => {
        if(err) {
          reject(err);
        } else if(!playlist) {
          reject(new errors.NotFound(`Could not find a playlist by "${id}"`));
        } else {

          playlist = this._assertModel(playlist);
          resolve(playlist);
        }
      });

    });

    //return super.get(id, params,callback);
  }

  create (data) {
    data._slug = data._slug || uuid.v4();
    return super.create.apply(this, arguments)
      .then((pl => this._assertModel(pl)));
  }

  update (id, data) {

    delete data._id;

    return new Promise((resolve, reject) => {

      this.Model.update({$or: [{_id:id},{_slug:id}]}, data, {returnUpdatedDocs:true}, (err, num, playlist) => {

        if(err) {
          reject(err);
        } else if(playlist.length === 1) {

          playlist = _.first(playlist);

          playlist = this._assertModel(playlist);

          resolve(playlist);
        } else {
          reject('Nothing changed');
        }
      });
    });
  }

}

const db = new NeDB({
  filename: './playlists.db',
  autoload: true
});

db.ensureIndex({fieldName: '_slug', unique: true});

module.exports = new PlaylistService({Model:db});
