const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  updateEvent,
  deleteEvent
} = require('../controllers/event.controller');

const Event = require('../models/Event.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Event), getEvents)
  .post(protect, authorize('Super Admin', 'Admin'), createEvent);

router.route('/:id')
  .get(getEvent)
  .put(protect, authorize('Super Admin', 'Admin'), updateEvent)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteEvent);

module.exports = router;