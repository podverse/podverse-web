
'use strict';

const Sequelize = require('sequelize');

var sequelize = new Sequelize('database', 'username', 'password', {
  host: 'localhost',
  dialect: 'sqlite',

  pool: {
    max: 5,
    min: 0,
    idle: 10000
  },

  // SQLite only
  storage: 'database.sqlite',

  logging: console.log
});

const Podcast = sequelize.define('podcast', {
  feedURL: {
    type: Sequelize.TEXT,
    allowNull: false,
    validate: {
      isUrl: true,
      notEmpty:true
    }
  },
  imageURL: {
    type: Sequelize.TEXT,
    allowNull: true,
    validate: {
      isUrl: true,
      notEmpty: true
    }
  },
  summary: Sequelize.TEXT,
  title: Sequelize.TEXT
});

const Episode = sequelize.define('episode', {

});

Episode.belongsTo(Podcast, {
  foreignKey: { allowNull: false }
});

const Playlist = sequelize.define('playlist', {
  title: Sequelize.TEXT
});

const MediaRef = sequelize.define('mediaRef', {
  // episode
  title: Sequelize.TEXT,
  duriation: Sequelize.INTEGER.UNSIGNED
});

MediaRef.belongsTo(Episode, {
  foreignKey: { allowNull: false }
});

// Many-To-Many refs
Playlist.belongsToMany(MediaRef, {through: 'playlist_items'}, {
  foreignKey: { allowNull: false }
});
MediaRef.belongsToMany(Playlist, {through: 'playlist_items'}, {
  foreignKey: { allowNull: false }
});

sequelize.sync().then(() => {

  Podcast.create({feedURL: 'http://dx.com/df'})
    .then(podcast => {
      return Episode.create({podcastId: podcast.id});
    })
    .then(episode => {
      return MediaRef.create({episodeId: episode.id})
    })
    .then(mr => {

      let mrPromise = MediaRef.findById(mr.id, {include: [
        { model: Episode, include: [Podcast] }
      ]});

      return Promise.all([mrPromise, Playlist.create({title: 'hooo'})]);
    })
    .then(vals => {

      let mediaRef = vals[0];
      let playlist = vals[1];

      console.log(JSON.stringify(playlist,null, '  '));

      return playlist.addMediaRef(mediaRef)
        .then(()=>Promise.resolve(playlist));

    })
    .then(pl => {
      return Playlist.findById(pl.id)
    })
    .then(pl => {
      return Promise.all([pl, pl.getMediaRefs()]);
    })
    .then(vals => {

      let playlist = vals[0],
        mediaRefs = vals[1];

      playlist.dataValues.items = mediaRefs;

      console.log(JSON.stringify(playlist, null, '  '));
    })



});


module.exports = sequelize;
