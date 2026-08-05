const express = require('express');
const {
  createCategory,
  getCategories,
  getCategory,
  updateCategory,
  deleteCategory
} = require('../controllers/bookCategory.controller');

const BookCategory = require('../models/BookCategory.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(BookCategory), getCategories)
  .post(protect, authorize('Super Admin', 'Admin'), createCategory);

router.route('/:id')
  .get(getCategory)
  .put(protect, authorize('Super Admin', 'Admin'), updateCategory)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteCategory);

module.exports = router;
