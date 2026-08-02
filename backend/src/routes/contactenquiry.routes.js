const express = require('express');
const {
  createContactEnquiry,
  getContactEnquirys,
  getContactEnquiry,
  updateContactEnquiry,
  deleteContactEnquiry
} = require('../controllers/contactenquiry.controller');

const ContactEnquiry = require('../models/ContactEnquiry.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(ContactEnquiry), getContactEnquirys)
  .post(createContactEnquiry);

router.route('/:id')
  .get(getContactEnquiry)
  .put(protect, authorize('Super Admin', 'Admin'), updateContactEnquiry)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteContactEnquiry);

module.exports = router;