module.exports = {
  up: function (queryInterface, Sequelize, done) {
    return queryInterface.addColumn(
        'mediaRefs',
        'episodeId',
        Sequelize.TEXT
      ).then(() => {
        done();
      });
  }
}
