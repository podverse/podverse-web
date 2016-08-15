'use strict';

module.exports = function(sequelize, DataTypes) {

  // You could call this a clip or you could call it an episode.
  // I would consider if startTime && endTime are null, then it
  // is referencing the entire episode.

  const mediaRef = sequelize.define('mediaRef', {

    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV1,
      primaryKey: true
    },

    // url: see getterMethods / setterMethods

    // TODO: do we need to ensure these are positive integers?
    // TODO: Enable multiple start / end times in one mediaRef
    startTime: {
      type: DataTypes.INTEGER,
      validation: {
        notEmpty: true
      }
    },

    endTime: {
      type: DataTypes.INTEGER
    },

    // TODO: calculate duration based on endTime - startTime
    duration: {
      type: DataTypes.INTEGER
    },

    title: {
      type: DataTypes.TEXT
    },

    ownerId: {
      type: DataTypes.TEXT,
      allowNull: false,
      validation: {
        notEmpty: true,
      }
    },

    dateCreated: {
      type: DataTypes.DATE
    },

    lastUpdated: {
      type: DataTypes.DATE
    }

  }, {
    updatedAt: 'dateCreated',
    createdAt: 'lastUpdated',
    setterMethods: {
        podverseURL: function (value) {
            this.setDataValue('podverseURL', value);
        }
    }
  });

  return mediaRef;
};
