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
      defaultValue: 0
    },

    endTime: DataTypes.INTEGER,

    title: DataTypes.TEXT,

    ownerId: {
      type: DataTypes.TEXT,
      allowNull: false,
      validation: {
        notEmpty: true,
      }
    },

    ownerName: DataTypes.TEXT,

    dateCreated: DataTypes.DATE,

    lastUpdated: DataTypes.DATE

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
