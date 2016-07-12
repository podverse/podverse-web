"use strict";

let
  service = require('feathers-sequelize').Service,
  errors = require('feathers-errors').default,
  _ = require('lodash'),
  config = require('./config.js'),
  uuid = require('uuid');

class PlaylistService extends service {

  constructor(options) {
    super(options);
  }

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

  get(id, params) {
    return this.Model.findOne({
        where: {
          $or: {
            id:id,
            _slug:id
          }
        }
      }).then(playlist => {
        playlist = this._transformAfterRetrieval(playlist);
        return playlist;
    }).catch(err => {
      return new errors.GeneralError(err);
    });
  }

  create (data) {
    data = this._transformBeforeSave(data);

    // Don't use whatever id is being sent.
    delete data.id;

    return super.create.apply(this, arguments)
      .then((pl => this._transformAfterRetrieval(pl)));
  }

  // TODO: make sure user cannot override someone else's primary id with a slug that
  // matches that id.
  update(id, data, params) {
    return this.Model.update(data, {
      where: {
        $or: {
          id: id,
          _slug: id
        }
      }
    }).catch(err => {
      return new errors.GeneralError(err);
    });
  }

  // TODO: make sure user cannot override someone else's primary id with a slug that
  // matches that id.
  patch(id, data, params) {
    const keys = Object.keys(data);

    return this.Model.update(data, {
      where: {
        $or: {
          id: id,
          _slug: id
        }
      },
      options: {
        fields: [keys]
      }
    }).catch(err => {
      return new errors.GeneralError(err);
    });
  }

  // TODO: make sure only the playlist's creator can remove it
  // TODO: handle the return after destroying properly
  remove(id, params) {
    return this.Model.findOne({
      where: {
        $or: {
          id: id,
          _slug: id
        }
      }
    }).then(playlist => {
      playlist.destroy();
      return "Playlist Deleted"
    })
    .catch(err => {
      return new errors.GeneralError(err);
    });
  }
  
}



module.exports = PlaylistService;
