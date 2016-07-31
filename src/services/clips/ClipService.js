const
    errors = require('feathers-errors'),
    SequelizeService = require('feathers-sequelize').Service,
    {applyOwnerId, ensureAuthenticated} = require('hooks/common.js'),
    {locator} = require('locator.js');

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
      update: [ensureAuthenticated, applyOwnerId]
    };

    this.after = { };

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

  create (data, params={}) {

    const {Episode, Podcast} = this.Models;

    let podcast = this._resolvePodcastData(data),
      episode = data.episode,
      isPodcastReferenced = !!podcast;

    if (isPodcastReferenced) {

      // Lets create/find the podcast
      return Podcast.findOrCreate({
        where: {
          feedURL: podcast.feedURL
        },
        defaults: podcast
      })

      // Then create/find the episode
      .then(([podcast]) => {
        return Episode.findOrCreate({
          where: {
            mediaURL: episode.mediaURL
          },
          defaults: Object.assign({}, episode, {podcastId: podcast.id })
        });
      })

      // Then create the MediaRef
      .then(([episode]) => {
        const clip = Object.assign({}, data, {episodeId: episode.id});

        return super.create(clip, params);
      })

      .catch(e => {
        return new errors.GeneralError(e);
      });
    }

    // Default
    return super.create(data, params);
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
