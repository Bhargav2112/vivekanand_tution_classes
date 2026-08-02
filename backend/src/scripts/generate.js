const fs = require('fs');
const path = require('path');

const models = [
  'Admin', 'Teacher', 'Student', 'Admission', 'Course',
  'CourseCategory', 'Batch', 'Result', 'Gallery', 'Video',
  'Testimonial', 'Event', 'Notice', 'Blog', 'FAQ',
  'WebsitePage', 'SEO', 'Setting', 'ContactEnquiry',
  'Newsletter', 'Download'
];

const bq = String.fromCharCode(96); // backtick
const sq = String.fromCharCode(39); // single quote

const getModelTemplate = (name) => {
  return [
    "const mongoose = require('mongoose');",
    "",
    "const " + name.toLowerCase() + "Schema = new mongoose.Schema({",
    "  title: { type: String, required: false }, // Placeholder field",
    "  isActive: { type: Boolean, default: true }",
    "}, { timestamps: true });",
    "",
    "module.exports = mongoose.model('" + name + "', " + name.toLowerCase() + "Schema);"
  ].join('\n');
};

const getControllerTemplate = (name) => {
  return [
    "const " + name + " = require('../models/" + name + ".model');",
    "",
    "exports.create" + name + " = async (req, res, next) => {",
    "  try {",
    "    const doc = await " + name + ".create(req.body);",
    "    res.status(201).json({ success: true, data: doc });",
    "  } catch (error) { next(error); }",
    "};",
    "",
    "exports.get" + name + "s = async (req, res, next) => {",
    "  try {",
    "    const docs = await " + name + ".find();",
    "    res.status(200).json({ success: true, count: docs.length, data: docs });",
    "  } catch (error) { next(error); }",
    "};",
    "",
    "exports.get" + name + " = async (req, res, next) => {",
    "  try {",
    "    const doc = await " + name + ".findById(req.params.id);",
    "    if (!doc) {",
    "      return res.status(404).json({ success: false, message: 'Resource not found' });",
    "    }",
    "    res.status(200).json({ success: true, data: doc });",
    "  } catch (error) { next(error); }",
    "};",
    "",
    "exports.update" + name + " = async (req, res, next) => {",
    "  try {",
    "    const doc = await " + name + ".findByIdAndUpdate(req.params.id, req.body, {",
    "      new: true,",
    "      runValidators: true",
    "    });",
    "    if (!doc) {",
    "      return res.status(404).json({ success: false, message: 'Resource not found' });",
    "    }",
    "    res.status(200).json({ success: true, data: doc });",
    "  } catch (error) { next(error); }",
    "};",
    "",
    "exports.delete" + name + " = async (req, res, next) => {",
    "  try {",
    "    const doc = await " + name + ".findByIdAndDelete(req.params.id);",
    "    if (!doc) {",
    "      return res.status(404).json({ success: false, message: 'Resource not found' });",
    "    }",
    "    res.status(200).json({ success: true, data: {} });",
    "  } catch (error) { next(error); }",
    "};"
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
    "const { protect, authorize } = require('../middlewares/auth.middleware');",
    "",
    "const router = express.Router();",
    "",
    "router.route('/')",
    "  .get(get" + name + "s)",
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

const modelsDir = path.join(__dirname, '../models');
const controllersDir = path.join(__dirname, '../controllers');
const routesDir = path.join(__dirname, '../routes');

// Create directories if they don't exist
[modelsDir, controllersDir, routesDir].forEach(dir => {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

let appJsRoutes = '';

models.forEach(model => {
  const modelName = model;
  const fileName = model.toLowerCase();
  
  // Model
  fs.writeFileSync(path.join(modelsDir, modelName + '.model.js'), getModelTemplate(modelName));
  // Controller
  fs.writeFileSync(path.join(controllersDir, fileName + '.controller.js'), getControllerTemplate(modelName));
  // Route
  fs.writeFileSync(path.join(routesDir, fileName + '.routes.js'), getRouteTemplate(modelName));
  
  appJsRoutes += "app.use('/api/v1/" + fileName + "s', require('./src/routes/" + fileName + ".routes'));\\n";
});

console.log('Generated models, controllers, and routes!');
console.log('Add these to app.js:\\n');
console.log(appJsRoutes);
