const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    {applyOwnerId, ensureAuthenticated} = require('hooks/common.js'),
    config = require('config.js'),
    {locator} = require('locator.js'),
    {addURL} = require('hooks/clip/clip.js'),
    {isClipMediaRef} = require('constants.js');

class ClipService extends SequelizeService {

  constructor () {

    const Models = locator.get('Models');

    super({
      Model: Models.MediaRef
    });
    this.Models = Models;

    // Hooks
    // -----
    this.before = {
      create: [ensureAuthenticated, applyOwnerId],
      update: [ensureAuthenticated]
    };

    this.after = {
      get: [addURL],
      create: [addURL],
      update: [addURL]
    };

  }

  get (id, params={}) {
    const {Episode, Podcast} = this.Models;

    params.sequelize = {
        include: [
          { model: Episode, include: [Podcast] }
        ]
    };

    return super.get(id, params);
  }

  find (params={}) {
    const {MediaRef, Episode, Podcast} = this.Models;

    params.sequelize = {
      include: [{ model: Episode, include: [Podcast] }],
      where: isClipMediaRef
    };

    return super.find(params);
  }

  create (data, params={}) {

    return new Promise((resolve, reject) => {

      const {Episode, Podcast} = this.Models;

      let podcast = this._resolvePodcastData(data),
        episode = data.episode,
        isPodcastReferenced = !!podcast;

      if (isPodcastReferenced) {
        // Lets create/find the podcast
        return Podcast.findOrCreate({
          where: {
            $or: [
              { feedURL: podcast.feedURL },
              { id: podcast.id }
            ]
          },
          defaults: podcast
        })

        // Then create/find the episode
        .then(([podcast]) => {
          return Episode.findOrCreate({
            where: {
              $or: [
                { mediaURL: episode.mediaURL },
                { id: episode.id }
              ]
            },
            defaults: Object.assign({}, episode, {podcastId: podcast.id })
          });
        })

        // Then create the MediaRef
        .then(([episode]) => {
          const clip = Object.assign({}, data, {episodeId: episode.id});
          resolve(super.create(clip, params));
        })

        .catch(e => {
          reject(new errors.GeneralError(e));
        });
      } else {
        reject(new errors.GeneralError('No podcast referenced'));
      }
    });
  }

  _resolvePodcastData(data) {
    if (data.episode && data.episode.podcast) {
      return data.episode.podcast;
    }
  }

  update (id, data, params={}) {

    return this.Models.MediaRef.findById(id)
      .then(mediaRef => {

        if (mediaRef.ownerId !== params.userId) {
          throw new errors.Forbidden();
        } else {
          return super.update(id, data, params);
        }

      });
  }

}

ClipService.prototype.remove = undefined;
ClipService.prototype.patch = undefined;

module.exports = ClipService;
