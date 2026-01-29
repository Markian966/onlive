'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class Reservation extends Model {
    static associate(models) {
      Reservation.belongsTo(models.Event, { foreignKey: 'eventId' });
      Reservation.belongsTo(models.User, { foreignKey: 'userId' });
      Reservation.hasMany(models.ReservationSeat, { foreignKey: 'reservationId' });
    }
  }

  Reservation.init({
    eventId: { type: DataTypes.INTEGER, allowNull: false },
    userId: { type: DataTypes.INTEGER, allowNull: true },
    firstName: { type: DataTypes.STRING, allowNull: false },
    lastName: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, allowNull: false },
    totalPrice: DataTypes.FLOAT
  }, {
    sequelize,
    modelName: 'Reservation',
    tableName: 'Reservations'
  });

  return Reservation;
};