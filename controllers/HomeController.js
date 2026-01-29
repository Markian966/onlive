const { Event } = require('../models');

class HomeController {
  static async index(req, res) {
    try {
      const events = await Event.findAll({ 
        order: [['date', 'ASC']] 
      });

      res.render('layouts/main', {
        title: 'OnLive - Ticket Reservation System',
        body: '../pages/index',
        events: events
      });
    } catch (error) {
      console.error('Error fetching events:', error);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error loading events' 
      });
    }
  }
}

module.exports = HomeController;