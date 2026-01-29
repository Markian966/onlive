'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('ReservationSeats', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false
      },
      reservationId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Reservations',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      sector: {
        type: Sequelize.STRING,
        allowNull: false
      },
      row: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      seat: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    await queryInterface.addIndex('ReservationSeats', ['reservationId'], {
      name: 'reservation_seats_reservation_id_index'
    });

    await queryInterface.addIndex('ReservationSeats', ['sector', 'row', 'seat'], {
      name: 'reservation_seats_unique_seat_index'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('ReservationSeats');
  }
};
