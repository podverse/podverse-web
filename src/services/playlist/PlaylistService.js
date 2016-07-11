'use strict';

const service = require('feathers-sequelize').Service;
const errors = require('feathers-errors');
const configuration = require('feathers-configuration');

class PlaylistService extends service {
  constructor(options) {
    super(options);
    const app = this.app;
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
      // Gotta read sequelize docs and discover the best API methods for getting
      // all playlsit items and then also get all of the clips/episodes for those playlist initializeProductCustomAttributes

      // let playlistItems = playlist.getAllPlaylistItems();

      // get a list of media references
      // let mediaReferences = playlistItems.map(item => item.getMediaRef())

      // playlist.items = mediaReferences;

      return playlist;
    }).catch(err => {
      return new errors.GeneralError(err);
    });
  }

  // find(params [, callback]) {}

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
