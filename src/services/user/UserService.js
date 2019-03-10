const
    SequelizeService = require('feathers-sequelize').Service,
    {locator} = require('../../locator.js'),
    errors = require('feathers-errors');

class UserService extends SequelizeService {

  constructor () {
    const Models = locator.get('Models');
    const sqlEngine = locator.get('sqlEngine');

    super({
      Model: Models.User
    });
    this.Models = Models;
    this.sqlEngine = sqlEngine;

    // Hooks
    // -----
    this.before = {};

    this.after = {};
  }

  retrieveUserAndAllSubscribedPodcasts (id, params={}) {
    const {MediaRef, Playlist} = this.Models;

    if (id && id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.sqlEngine.query(`
      SELECT p.title, p."imageUrl", p.id, p."lastEpisodeTitle", p."lastPubDate" AS "lastEpisodePubDate", (
        SELECT url FROM "feedUrls"
        WHERE "podcastId"=p.id
        AND "isAuthority"=true
      ) AS "authorityFeedUrl"
      FROM "feedUrls" f, users u, podcasts p
      WHERE u.id='${id}'
      AND u."subscribedPodcastIds" @> ARRAY[f."podcastId"]::text[]
      AND p.id=f."podcastId"
      AND f."isAuthority"=true;
    `, { type: this.sqlEngine.QueryTypes.SELECT })
    .then(subscribedPodcasts => {

      return this.Model.findOne({
        where: {
          id:id
        }
      }).then(user => {
        user.dataValues.subscribedPodcasts = subscribedPodcasts;
        return user;
      }).catch(e => {
        console.log(e);
        throw new errors.GeneralError(e);
      });

    })
    .catch(e => {
      console.log(e);
      throw new errors.GeneralError(e);
    });
  }

  get (id, params={}) {
    const {MediaRef, Playlist} = this.Models;

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    // By default, include all the user's Subscribed Playlists and Playlist Items.
    return this.Model.findOne({
      where: {
        id:id
      },
      include: [{
        model: Playlist,
        through: 'subscribedPlaylists',
        include: [{
          model: MediaRef,
          through: 'playlistItems'
        }]
      }]
    }).then(user => {
      return user
    }).catch(e => {
      return new errors.GeneralError(e);
    });

  }

  create (data, params={}) {
    return new Promise((resolve, reject) => { resolve() })
    
    // const {Playlist} = this.Models;

    // return this.Model.findOrCreate({
    //   where: {
    //     id: params.userId
    //   },
    //   defaults: {
    //     id: params.userId,
    //     name: data.name || '',
    //     nickname: data.nickname || '',
    //     subscribedPodcastIds: data.subscribedPodcastIds || []
    //   },
    //   include: {
    //     model: Playlist,
    //     through: 'subscribedPlaylists'
    //   }
    // })
    // .then(user => {
    //   // TODO: I might be doing something wrong here. Basically I would like to do
    //   // getOrCreate so the returned object isn't in an array, but seems like that doesn't exist.
    //   return user[0];
    // })
    // .catch(e => {
    //   console.log(e);
    //   new errors.GeneralError(e);
    // });
  }

  update (id, data, params={}) {

    if (id !== params.userId) {
      throw new errors.Forbidden();
    }

    return this.Model.findById(id)
      .then(user => {

        if (!user) {
          return;
        }

        // Handle subscribing to a podcast
        if (params.subscribeToPodcastId|| params.unsubscribeFromPodcastId) {
          let subscribedPodcastIds = user.dataValues.subscribedPodcastIds || [];

          let podcastId = params.subscribeToPodcastId || params.unsubscribeFromPodcastId || null;

          // Handle subscribing from a podcast
          if (params.subscribeToPodcastId) {
            if (subscribedPodcastIds.indexOf(podcastId) === -1) {
              subscribedPodcastIds.push(podcastId);
            }
          }

          // Handle unsubscribing from a podcast
          if (params.unsubscribeFromPodcastId) {
            if (subscribedPodcastIds.indexOf(podcastId) > -1) {
              let index = subscribedPodcastIds.indexOf(podcastId);
              subscribedPodcastIds.splice(index, 1);
            }
          }

          return user.update({ subscribedPodcastIds: subscribedPodcastIds })
            .then(() => {
              return podcastId;
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
