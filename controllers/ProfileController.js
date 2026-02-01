const { User, Reservation, ReservationSeat, Event } = require('../models');

class ProfileController {
  static async show(req, res) {
    try {
      if (!req.user) {
        return res.redirect('/');
      }

      const reservations = await Reservation.findAll({
        where: { userId: req.user.id },
        include: [
          { model: Event },
          { model: ReservationSeat }
        ],
        order: [['createdAt', 'DESC']]
      });

      res.render('layouts/main', {
        title: 'My Profile',
        body: '../pages/profile',
        user: req.user,
        reservations: reservations
      });
    } catch (error) {
      console.error('Error loading profile:', error);
      res.status(500).render('layouts/main', { 
        title: 'Error',
        body: '../pages/error',
        message: 'Error loading profile: ' + error.message 
      });
    }
  }

  static async update(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Please login to update profile' });
      }

      const { firstName, lastName, email, currentPassword, newPassword } = req.body;

      const user = await User.findByPk(req.user.id);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      if (email && email !== user.email) {
        const existingUser = await User.findOne({ where: { email } });
        if (existingUser) {
          return res.status(400).json({ message: 'Email already in use' });
        }
      }

      if (newPassword) {
        if (!currentPassword) {
          return res.status(400).json({ message: 'Current password is required to set new password' });
        }

        const isValidPassword = await user.validatePassword(currentPassword);
        if (!isValidPassword) {
          return res.status(400).json({ message: 'Current password is incorrect' });
        }

        user.password = newPassword; 
      }

      if (firstName !== undefined) user.firstName = firstName;
      if (lastName !== undefined) user.lastName = lastName;
      if (email) user.email = email;

      await user.save();

      res.json({ 
        message: 'Profile updated successfully',
        user: { 
          id: user.id, 
          name: user.name, 
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email 
        }
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      res.status(500).json({ message: 'Error updating profile: ' + error.message });
    }
  }

  static async deleteReservation(req, res) {
    try {
      if (!req.user) {
        return res.status(401).json({ message: 'Please login to delete reservations' });
      }

      const reservation = await Reservation.findByPk(req.params.id);
      
      if (!reservation) {
        return res.status(404).json({ message: 'Reservation not found' });
      }

      if (reservation.userId !== req.user.id) {
        return res.status(403).json({ message: 'You can only delete your own reservations' });
      }

      await ReservationSeat.destroy({ where: { reservationId: reservation.id } });
      await reservation.destroy();
      
      res.json({ message: 'Reservation cancelled successfully' });
    } catch (error) {
      console.error('Error deleting reservation:', error);
      res.status(500).json({ message: 'Error canceling reservation: ' + error.message });
    }
  }
}

module.exports = ProfileController;