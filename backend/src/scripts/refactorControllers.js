const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, '../controllers');
const routesDir = path.join(__dirname, '../routes');

const models = [
  'Admin', 'Teacher', 'Student', 'Admission', 'Course',
  'CourseCategory', 'Batch', 'Result', 'Gallery', 'Video',
  'Testimonial', 'Event', 'Notice', 'Blog', 'FAQ',
  'WebsitePage', 'SEO', 'Setting', 'ContactEnquiry',
  'Newsletter', 'Download'
];

const bq = String.fromCharCode(96);

const getControllerTemplate = (name) => {
  return [
    "const " + name + " = require('../models/" + name + ".model');",
    "const asyncHandler = require('../middlewares/asyncHandler');",
    "",
    "exports.create" + name + " = asyncHandler(async (req, res, next) => {",
    "  const doc = await " + name + ".create(req.body);",
    "  res.status(201).json({ success: true, data: doc });",
    "});",
    "",
    "exports.get" + name + "s = asyncHandler(async (req, res, next) => {",
    "  res.status(200).json(res.advancedResults);",
    "});",
    "",
    "exports.get" + name + " = asyncHandler(async (req, res, next) => {",
    "  const doc = await " + name + ".findById(req.params.id);",
    "  if (!doc) {",
    "    return res.status(404).json({ success: false, message: 'Resource not found' });",
    "  }",
    "  res.status(200).json({ success: true, data: doc });",
    "});",
    "",
    "exports.update" + name + " = asyncHandler(async (req, res, next) => {",
    "  const doc = await " + name + ".findByIdAndUpdate(req.params.id, req.body, {",
    "    new: true,",
    "    runValidators: true",
    "  });",
    "  if (!doc) {",
    "    return res.status(404).json({ success: false, message: 'Resource not found' });",
    "  }",
    "  res.status(200).json({ success: true, data: doc });",
    "});",
    "",
    "exports.delete" + name + " = asyncHandler(async (req, res, next) => {",
    "  const doc = await " + name + ".findByIdAndDelete(req.params.id);",
    "  if (!doc) {",
    "    return res.status(404).json({ success: false, message: 'Resource not found' });",
    "  }",
    "  res.status(200).json({ success: true, data: {} });",
    "});"
  ].join('\n');
};

const getRouteTemplate = (name) => {
  return [
    "const express = require('express');",
    "const {",
    "  create" + name + ",",
    "  get" + name + "s,",
    "  get" + name + ",",
    "  update" + name + ",",
    "  delete" + name,
    "} = require('../controllers/" + name.toLowerCase() + ".controller');",
    "",
    "const " + name + " = require('../models/" + name + ".model');",
    "const advancedResults = require('../middlewares/advancedResults');",
    "const { protect, authorize } = require('../middlewares/auth.middleware');",
    "",
    "const router = express.Router();",
    "",
    "router.route('/')",
    "  .get(advancedResults(" + name + "), get" + name + "s)",
    "  .post(protect, authorize('Super Admin', 'Admin'), create" + name + ");",
    "",
    "router.route('/:id')",
    "  .get(get" + name + ")",
    "  .put(protect, authorize('Super Admin', 'Admin'), update" + name + ")",
    "  .delete(protect, authorize('Super Admin', 'Admin'), delete" + name + ");",
    "",
    "module.exports = router;"
  ].join('\n');
};

models.forEach(modelName => {
  const fileName = modelName.toLowerCase();
  fs.writeFileSync(path.join(controllersDir, fileName + '.controller.js'), getControllerTemplate(modelName));
  fs.writeFileSync(path.join(routesDir, fileName + '.routes.js'), getRouteTemplate(modelName));
});

console.log('Successfully refactored controllers and routes.');
