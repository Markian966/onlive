'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Event extends Model {
    static associate(models) {
      Event.hasMany(models.Reservation, { foreignKey: 'eventId' });
      Event.hasMany(models.Sector, { foreignKey: 'eventId' });
    }
  }

  Event.init({
    name: { type: DataTypes.STRING, allowNull: false },
    description: DataTypes.TEXT,
    date: { type: DataTypes.DATEONLY, allowNull: false },
    time: { type: DataTypes.TIME, allowNull: false },
    venue: DataTypes.STRING,
    price: DataTypes.FLOAT,
    imageUrl: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Event',
    tableName: 'Events'
  });

  return Event;
};