const express = require('express');
const {
  createAdmin,
  getAdmins,
  getAdmin,
  updateAdmin,
  deleteAdmin
} = require('../controllers/admin.controller');

const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

// Apply protection and Super Admin authorization to all admin management routes
router.use(protect);
router.use(authorize('Super Admin'));

router.route('/')
  .get(getAdmins)
  .post(createAdmin);

router.route('/:id')
  .get(getAdmin)
  .put(updateAdmin)
  .delete(deleteAdmin);

module.exports = router;