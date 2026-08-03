const User = require('../models/User.model');
const asyncHandler = require('../middlewares/asyncHandler');

// @desc    Create new admin / sub-admin (Super Admin only)
// @route   POST /api/v1/admins
// @access  Private/Super Admin
exports.createAdmin = asyncHandler(async (req, res, next) => {
  const { name, username, email, password, role } = req.body;

  const cleanUsername = (username || name || email.split('@')[0]).trim().toLowerCase();
  const cleanEmail = (email || `${cleanUsername}@vivekanand.com`).trim().toLowerCase();

  const userExists = await User.findOne({
    $or: [{ email: cleanEmail }, { username: cleanUsername }]
  });

  if (userExists) {
    return res.status(400).json({ success: false, message: 'આ નામ/યુઝરનેમ અથવા ઈમેલ ધરાવતો યુઝર પહેલેથી જ અસ્તિત્વમાં છે.' });
  }

  const user = await User.create({
    name: name || cleanUsername,
    username: cleanUsername,
    email: cleanEmail,
    password: password || 'Admin@123',
    role: role === 'Super Admin' ? 'Super Admin' : 'Admin',
    isVerified: true,
    isActive: true
  });

  res.status(201).json({
    success: true,
    message: 'એડમિન સફળતાપૂર્વક ઉમેરાયો',
    data: user
  });
});

// @desc    Get all admins & sub-admins (Super Admin only)
// @route   GET /api/v1/admins
// @access  Private/Super Admin
exports.getAdmins = asyncHandler(async (req, res, next) => {
  const admins = await User.find({
    role: { $in: ['Super Admin', 'Admin'] }
  }).sort({ createdAt: -1 });

  res.status(200).json({
    success: true,
    count: admins.length,
    data: admins
  });
});

// @desc    Get single admin (Super Admin only)
// @route   GET /api/v1/admins/:id
// @access  Private/Super Admin
exports.getAdmin = asyncHandler(async (req, res, next) => {
  const admin = await User.findById(req.params.id);
  if (!admin || !['Super Admin', 'Admin'].includes(admin.role)) {
    return res.status(404).json({ success: false, message: 'એડમિન મળ્યો નથી' });
  }
  res.status(200).json({ success: true, data: admin });
});

// @desc    Update admin details / password / role / status (Super Admin only)
// @route   PUT /api/v1/admins/:id
// @access  Private/Super Admin
exports.updateAdmin = asyncHandler(async (req, res, next) => {
  let admin = await User.findById(req.params.id);

  if (!admin) {
    return res.status(404).json({ success: false, message: 'એડમિન મળ્યો નથી' });
  }

  // Prevent modifying critical fields of main Super Admin admin1
  if (admin.username === 'admin1' && req.body.role && req.body.role !== 'Super Admin') {
    return res.status(400).json({ success: false, message: 'મુખ્ય સુપર એડમિન (admin1) નો રોલ બદલી શકાતો નથી.' });
  }

  if (req.body.name) admin.name = req.body.name;
  if (req.body.username) admin.username = req.body.username.trim().toLowerCase();
  if (req.body.email) admin.email = req.body.email.trim().toLowerCase();
  if (req.body.role) admin.role = req.body.role;
  if (typeof req.body.isActive === 'boolean') admin.isActive = req.body.isActive;
  
  if (req.body.password && req.body.password.trim() !== '') {
    admin.password = req.body.password;
  }

  await admin.save();

  res.status(200).json({
    success: true,
    message: 'એડમિન સફળતાપૂર્વક અપડેટ થયો',
    data: admin
  });
});

// @desc    Delete sub-admin (Super Admin only)
// @route   DELETE /api/v1/admins/:id
// @access  Private/Super Admin
exports.deleteAdmin = asyncHandler(async (req, res, next) => {
  const admin = await User.findById(req.params.id);

  if (!admin) {
    return res.status(404).json({ success: false, message: 'એડમિન મળ્યો નથી' });
  }

  if (admin.username === 'admin1' || admin.email === 'admin1@vivekanand.com') {
    return res.status(400).json({ success: false, message: 'મુખ્ય સુપર એડમિન (admin1) એકાઉન્ટ ડિલીટ કરી શકાતું નથી.' });
  }

  await User.findByIdAndDelete(req.params.id);

  res.status(200).json({
    success: true,
    message: 'એડમિન સફળતાપૂર્વક ડિલીટ થયો',
    data: {}
  });
});