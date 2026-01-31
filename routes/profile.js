const express = require('express');
const router = express.Router();
const ProfileController = require('../controllers/ProfileController');

const ensureUser = (req, res, next) => {
  if (res.locals.user && !req.user) {
    req.user = res.locals.user;
  }
  next();
};

router.get('/', ensureUser, ProfileController.show);
router.post('/update', ensureUser, ProfileController.update);
router.post('/reservations/:id/delete', ensureUser, ProfileController.deleteReservation);

module.exports = router;