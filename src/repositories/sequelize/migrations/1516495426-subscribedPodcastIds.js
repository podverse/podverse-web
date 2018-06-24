const {readFileSync} = require('fs');

module.exports = {
  up: function (queryInterface, Sequelize, done) {

    return queryInterface.renameColumn(
      'users',
      'subscribedPodcastFeedUrls',
      'subscribedPodcastIds'
    ).then(() => {
      return queryInterface.addColumn(
        'mediaRefs',
        'podcastId',
        Sequelize.TEXT
      ).then(() => {
        done();
      })
    });
  }

}
