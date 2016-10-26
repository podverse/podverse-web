const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('locator.js'),
    errors = require('feathers-errors'),
    {ensureAuthenticated} = require('hooks/common.js');

class UserService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');

    super({
      Model: Models.User
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [ensureAuthenticated],
      update: [ensureAuthenticated],
      patch: [ensureAuthenticated]
    };

    this.after = {};
  }

  get (id, params={}) {
    const {Podcast, Episode, MediaRef, Playlist} = this.Models;

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.Model.findOne({
      where: {
        id:id
      },
      include: [
        {
          model: Podcast,
          through: 'subscribedPodcasts',
          include: [{
            model: Episode
          }]
        },
        {
          model: Playlist,
          through: 'subscribedPlaylists',
          include: [
            { model: MediaRef,
              through: 'playlistItems',
              include: [{
                model: Episode, include: [Podcast]
              }],
            }
          ]
        }
      ]
    }).then(user => {
      return user
    }).catch(e => {
      return new errors.GeneralError(e);
    });
  }

  // TODO: ensure that only the app can create users, so that people can't
  // just create users willy-nilly
  create (data, params={}) {
    const {Podcast, Playlist} = this.Models;

    return this.Model.findOrCreate({
      where: {
        id: params.userId
      },
      defaults: {
        name: data.name || ''
      },
      include: [{
        model: Podcast,
        through: 'subscribedPodcasts'
      },
      { model: Playlist,
        through: 'subscribedPlaylists'
      }]
    })
    .then(user => {
      // TODO: I must be doing something wrong here. Basically I would like to do
      // getOrCreate so the returned object isn't in an array, but seems like that doesn't exist.
      return user[0];
    })
    .catch(e => {
      console.log(e);
      new errors.GeneralError(e);
    });
  }

  update (id, data, params={}) {

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.Model.findById(id)
      .then(user => {

        // Handle subscribing to a podcast
        if (params.subscribeToPodcast) {
          return user.addPodcasts([params.subscribeToPodcast])
            .then(() => {
              return params.subscribeToPodcast
            });
        }

        // Handle unsubscribing from a podcast
        if (params.unsubscribeFromPodcast) {
          return user.removePodcast([params.unsubscribeFromPodcast])
            .then(() => {
              return params.unsubscribeToPodcast
            });
        }

        // Handle subscribing to a playlist
        if (params.subscribeToPlaylist) {
          return user.addPlaylists([params.subscribeToPlaylist])
            .then(() => {
              return params.subscribeToPlaylist
            });
        }

        // Handle unsubscribing from a playlist
        if (params.unsubscribeFromPlaylist) {
          return user.removePlaylist([params.unsubscribeFromPlaylist])
            .then(() => {
              return params.unsubscribeToPlaylist
            });
        }

      });

  }

  patch (id, data, params={}) {

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    var fieldsToUpdate = {
      'name': data.name
    };

    if (fieldsToUpdate.length < 1) {
      throw new errors.GeneralError('There must be a valid property to update.')
    }

    return this.Model.update(fieldsToUpdate, {
      where: {
        id: id
      }
    })
      .then(user => {
        const {Playlist} = this.Models,
              PlaylistService = locator.get('PlaylistService');

        return Playlist.update({ ownerName: data.name }, { where: { ownerId: params.userId } });
      })
  }

}

UserService.prototype.find = undefined;
UserService.prototype.remove = undefined;

module.exports = UserService;
