'use strict';

// clip-model.js - A sequelize model
// 
// See http://docs.sequelizejs.com/en/latest/docs/models-definition/
// for more of what you can do here.

const Sequelize = require('sequelize');

module.exports = function(sequelize) {
  const clip = sequelize.define('clips', {
    text: {
      type: Sequelize.STRING,
      allowNull: false
    }
  }, {
    freezeTableName: true
  });

  clip.sync();

  return clip;
};
