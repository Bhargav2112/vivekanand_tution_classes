const express = require('express');
const {
  uploadImage,
  uploadImages,
  uploadPdf,
  deleteImage,
} = require('../controllers/upload.controller');
const upload = require('../middlewares/upload.middleware');
const { protect, authorize } = require('../middlewares/auth.middleware');

const router = express.Router();

router.use(protect);
router.use(authorize('Super Admin', 'Admin'));

router.post('/image', upload.single('image'), uploadImage);
router.post('/images', upload.array('images', 10), uploadImages);
router.post('/pdf', upload.single('pdf'), uploadPdf);
router.delete('/image', deleteImage); // use ?public_id=...

module.exports = router;
