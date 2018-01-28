const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize) {

    queryInterface.renameColumn(
      'users',
      'subscribedPodcastFeedUrls',
      'subscribedPodcastIds'
    );

    queryInterface.addColumn(
      'mediaRefs',
      'podcastId',
      Sequelize.TEXT
    );

  }

}
