'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Sector extends Model {
    static associate(models) {
      Sector.belongsTo(models.Event, { foreignKey: 'eventId' });
    }
  }

  Sector.init({
    eventId: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    name: { 
      type: DataTypes.STRING, 
      allowNull: false 
    },
    rows: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    },
    seatsPerRow: { 
      type: DataTypes.INTEGER, 
      allowNull: false 
    }
  }, {
    sequelize,
    modelName: 'Sector',
    tableName: 'Sectors'
  });

  return Sector;
};