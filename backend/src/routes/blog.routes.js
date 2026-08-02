const express = require('express');
const {
  createBlog,
  getBlogs,
  getBlog,
  updateBlog,
  deleteBlog
} = require('../controllers/blog.controller');

const Blog = require('../models/Blog.model');
const advancedResults = require('../middlewares/advancedResults');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.route('/')
  .get(advancedResults(Blog), getBlogs)
  .post(protect, authorize('Super Admin', 'Admin'), createBlog);

router.route('/:id')
  .get(getBlog)
  .put(protect, authorize('Super Admin', 'Admin'), updateBlog)
  .delete(protect, authorize('Super Admin', 'Admin'), deleteBlog);

module.exports = router;