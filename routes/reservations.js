const express = require('express');
const router = express.Router();
const ReservationController = require('../controllers/ReservationController');

const ensureUser = (req, res, next) => {
  if (res.locals.user && !req.user) {
    req.user = res.locals.user;
  }
  next();
};

router.get('/', ensureUser, ReservationController.index);
router.post('/create', ensureUser, ReservationController.create);
router.post('/delete/:id', ensureUser, ReservationController.delete);

module.exports = router;