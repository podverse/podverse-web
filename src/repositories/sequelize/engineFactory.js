const Sequelize = require('sequelize');

module.exports = function (config) {

  const sequelize = new Sequelize(config);

  return sequelize;
};
