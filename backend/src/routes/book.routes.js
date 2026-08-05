const express = require('express');
const {
  createBook,
  getBooks,
  getBook,
  updateBook,
  deleteBook
} = require('../controllers/book.controller');

const Book = require('../models/Book.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Book, 'category'), getBooks)
  .post(protect, authorize('Super Admin', 'Admin'), createBook);

router.route('/:id')
  .get(getBook)
  .put(protect, authorize('Super Admin', 'Admin'), updateBook)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteBook);

module.exports = router;
