"use strict";

let
  NeDBService = require('feathers-nedb').Service,
  errors = require('feathers-errors').default,
  _ = require('lodash'),
  config = require('./config.js'),
  uuid = require('uuid');

class PlaylistService extends NeDBService {

  _transformAfterRetrieval (data) {
    // Add in URL
    let id = data._slug || data._id;
    data.url = `${config.baseURL}/pl/${id}`;

    return data;
  }

  _transformBeforeSave (data) {

    delete data.url;

    data._slug = data._slug || uuid.v4();
    data.items = data.items || [];

    return data;
  }

  find (params) {
    return new Promise((resolve, reject) => {

      let userId = params.query.userId;

      if (!userId) {
        return resolve([]);
      }

      this.Model.find({userId}, (err, playlists) => {
        if(err) {
          reject(err);
        } else {
          playlists.forEach(() => {
            this._transformAfterRetrieval(playlists);
          });
          resolve(playlists);
        }
      });

    });
  }

  get (id) {
    return new Promise((resolve, reject) => {

      this.Model.findOne({$or: [{_id:id},{_slug:id}]}, (err, playlist) => {
        if(err) {
          reject(err);
        } else if(!playlist) {
          reject(new errors.NotFound(`Could not find a playlist by "${id}"`));
        } else {

          playlist = this._transformAfterRetrieval(playlist);
          resolve(playlist);
        }
      });

    });

    //return super.get(id, params,callback);
  }

  create (data) {

    data = this._transformBeforeSave(data);

    // Don't use whatever id is being sent.
    delete data._id;

    return super.create.apply(this, arguments)
      .then((pl => this._transformAfterRetrieval(pl)));
  }

  update (id, data, params) {

    // Don't use whatever id is being sent in the payload.
    delete data._id;

    // Make sure the data _slug reflects the playlist we're posting.
    data._slug = id;

    if (data.userId === params.user) {

      return new Promise((resolve, reject) => {

        if(!id) {
            throw new errors.NotAcceptable(`Try using POST instead of PUT.`);
        }

        let opts = {returnUpdatedDocs:true, upsert:true};


        data = this._transformBeforeSave(data);

        this.Model.update({$or: [{_id:id},{_slug:id}]}, data, opts, (err, num, playlist) => {

          if(err) {
            reject(err);
          } else if(playlist) {

            // Shift a single playlist out of an array.
            if(Array.isArray(playlist) && playlist.length === 1) {
              playlist = _.first(playlist);
            }

            playlist = this._transformAfterRetrieval(playlist);

            resolve(playlist);
          } else {
            reject(new errors.NotFound(`Could not find a playlist by "${id}"`));
          }
        });

      });
    }

    // TODO: else what should we do if a user tries to update someone else's playlist?
  }

}



module.exports = PlaylistService;
