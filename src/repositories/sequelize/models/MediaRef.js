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

    startTime: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      validation: {
        isNumeric: true
      }
    },

    endTime: {
      type: DataTypes.INTEGER,
      validation: {
        isNumeric: true
      }
    },

    title: DataTypes.TEXT,

    description: DataTypes.TEXT,

    ownerId: DataTypes.TEXT,

    ownerName: DataTypes.TEXT,

    dateCreated: DataTypes.DATE,

    lastUpdated: DataTypes.DATE

  }, {
    updatedAt: 'lastUpdated',
    createdAt: 'dateCreated',
    setterMethods: {
        podverseURL: function (value) {
            this.setDataValue('podverseURL', value);
        }
    }
  });

  return mediaRef;
};
