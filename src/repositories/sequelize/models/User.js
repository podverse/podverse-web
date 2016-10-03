'use strict';

module.exports = function(sequelize, DataTypes) {

  const user = sequelize.define('user', {

    id: {
      type: DataTypes.STRING,
      primaryKey: true
    }

  });

  return user;

}
