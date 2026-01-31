const { Event, Reservation, ReservationSeat, Sector, sequelize } = require('../models');

class ReservationController {
  static async create(req, res) {
    const transaction = await sequelize.transaction();

    try {
      const { eventId, seats, firstName, lastName, email } = req.body;
      
      let selectedSeats;
      try {
        selectedSeats = typeof seats === 'string' ? JSON.parse(seats) : seats;
      } catch (e) {
        await transaction.rollback();
        return res.status(400).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'Invalid seats format' 
        });
      }

      if (!selectedSeats || selectedSeats.length === 0) {
        await transaction.rollback();
        return res.status(400).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'Please select at least one seat' 
        });
      }

      const event = await Event.findByPk(eventId);
      if (!event) {
        await transaction.rollback();
        return res.status(404).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'Event not found' 
        });
      }

      const existingReservations = await Reservation.findAll({
        where: { eventId },
        include: [{
          model: ReservationSeat,
          required: false
        }],
        transaction
      });

      const reservedSeatKeys = [];
      existingReservations.forEach(r => {
        if (r.ReservationSeats && r.ReservationSeats.length > 0) {
          r.ReservationSeats.forEach(s => {
            reservedSeatKeys.push(`${s.sector}-${s.row}-${s.seat}`);
          });
        }
      });

      for (const seat of selectedSeats) {
        const seatKey = `${seat.sector}-${seat.row}-${seat.seat}`;
        if (reservedSeatKeys.includes(seatKey)) {
          await transaction.rollback();
          return res.status(400).render('layouts/main', { 
            title: 'Error',
            body: '../pages/error',
            message: `Seat ${seatKey} is already reserved` 
          });
        }
      }

      const totalPrice = selectedSeats.length * event.price;
      
      const reservation = await Reservation.create({
        userId: req.user ? req.user.id : null,
        eventId,
        firstName,
        lastName,
        email,
        totalPrice
      }, { transaction });

      const seatsToCreate = selectedSeats.map(seat => ({
        reservationId: reservation.id,
        sector: seat.sector,
        row: seat.row,
        seat: seat.seat
      }));
      
      const createdSeats = await ReservationSeat.bulkCreate(seatsToCreate, { transaction });
      await transaction.commit();

      reservation.seats = createdSeats;

      const isRegisteredUser = req.user ? true : false;

      res.render('layouts/main', {
        title: 'Reservation Confirmed',
        body: '../pages/confirmation',
        reservation: reservation,
        event: event,
        isRegisteredUser: isRegisteredUser
      });
    } catch (error) {
      await transaction.rollback();
      console.error('Error creating reservation:', error);
      console.error('Stack:', error.stack);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error creating reservation: ' + error.message 
      });
    }
  }

  static async index(req, res) {
    try {
      let reservations = [];
      
      if (req.user) {
        reservations = await Reservation.findAll({
          where: { userId: req.user.id },
          include: [
            { model: Event },
            { model: ReservationSeat }
          ],
          order: [['createdAt', 'DESC']]
        });
      }

      res.render('layouts/main', {
        title: 'My Reservations',
        body: '../my-reservations',
        reservations: reservations
      });
    } catch (error) {
      console.error('Error fetching reservations:', error);
      console.error('Stack:', error.stack);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error loading reservations: ' + error.message 
      });
    }
  }

  static async delete(req, res) {
    try {
      if (!req.user) {
        return res.status(401).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'Please login to delete reservations' 
        });
      }

      const reservation = await Reservation.findByPk(req.params.id);
      
      if (!reservation) {
        return res.status(404).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'Reservation not found' 
        });
      }

      if (reservation.userId !== req.user.id) {
        return res.status(403).render('layouts/main', { 
          title: 'Error',
          body: '../pages/error',
          message: 'You can only delete your own reservations' 
        });
      }

      await ReservationSeat.destroy({ where: { reservationId: reservation.id } });
      await reservation.destroy();
      
      res.redirect('/reservations');
    } catch (error) {
      console.error('Error deleting reservation:', error);
      console.error('Stack:', error.stack);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error canceling reservation: ' + error.message 
      });
    }
  }
}

module.exports = ReservationController;