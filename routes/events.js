const express = require('express');
const router = express.Router();
const EventController = require('../controllers/EventController');

router.get('/:id', EventController.show);
router.get('/:id/reserve', EventController.reservationForm);

module.exports = router;
