'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  class ReservationSeat extends Model {
    static associate(models) {
      ReservationSeat.belongsTo(models.Reservation, { foreignKey: 'reservationId' });
    }
  }

  ReservationSeat.init({
    reservationId: { type: DataTypes.INTEGER, allowNull: false },
    sector: { type: DataTypes.STRING, allowNull: false },
    row: { type: DataTypes.INTEGER, allowNull: false },
    seat: { type: DataTypes.INTEGER, allowNull: false }
  }, {
    sequelize,
    modelName: 'ReservationSeat',
    tableName: 'ReservationSeats'
  });

  return ReservationSeat;
};
