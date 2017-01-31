const Sequelize = require('sequelize');

module.exports = function ({ uri } = {}) {

  const sequelize = new Sequelize(uri, {logging: false});

  return sequelize;
};
