const express = require('express');
const { getInstagramFeed } = require('../controllers/instagram.controller');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(getInstagramFeed);

module.exports = router;
