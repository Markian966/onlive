const { Event, Reservation, ReservationSeat, Sector } = require('../models');

class EventController {
  static async show(req, res) {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [{
          model: Sector,
          required: false
        }]
      });
      
      if (!event) {
        return res.status(404).render('layouts/main', { 
          title: 'Event Not Found',
          body: '../pages/error',
          message: 'Event not found' 
        });
      }

      const reservations = await Reservation.findAll({
        where: { eventId: event.id },
        include: [{
          model: ReservationSeat,
          required: false
        }]
      });

      const reservedSeats = [];
      reservations.forEach(r => {
        if (r.ReservationSeats && r.ReservationSeats.length > 0) {
          r.ReservationSeats.forEach(s => {
            reservedSeats.push(`${s.sector}-${s.row}-${s.seat}`);
          });
        }
      });

      res.render('layouts/main', {
        title: event.name,
        body: '../pages/event-details',
        event: event,
        reservedSeats: reservedSeats
      });
    } catch (error) {
      console.error('Error fetching event:', error);
      console.error('Error stack:', error.stack);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error loading event: ' + error.message
      });
    }
  }

  static async reservationForm(req, res) {
    try {
      const event = await Event.findByPk(req.params.id, {
        include: [{
          model: Sector,
          required: false
        }]
      });
      
      if (!event) {
        return res.status(404).render('layouts/main', { 
          title: 'Event Not Found',
          body: '../pages/error',
          message: 'Event not found' 
        });
      }

      const reservations = await Reservation.findAll({
        where: { eventId: event.id },
        include: [{
          model: ReservationSeat,
          required: false
        }]
      });

      const reservedSeats = [];
      reservations.forEach(r => {
        if (r.ReservationSeats && r.ReservationSeats.length > 0) {
          r.ReservationSeats.forEach(s => {
            reservedSeats.push(`${s.sector}-${s.row}-${s.seat}`);
          });
        }
      });

      res.render('layouts/main', {
        title: `Reservation - ${event.name}`,
        body: '../pages/reservation',
        event: event,
        reservedSeats: reservedSeats
      });
    } catch (error) {
      console.error('Error loading reservation form:', error);
      console.error('Error stack:', error.stack);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error loading reservation form: ' + error.message
      });
    }
  }
}

module.exports = EventController;