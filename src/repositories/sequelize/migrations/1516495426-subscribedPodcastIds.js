const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize, done) {

    return [
      queryInterface.renameColumn(
        'users',
        'subscribedPodcastFeedUrls',
        'subscribedPodcastIds'
      ),
      queryInterface.addColumn(
        'mediaRefs',
        'podcastId',
        Sequelize.TEXT
      )
    ]

  },

  down: function (queryInterface) {
    return queryInterface.dropAllTables();
  }
}
