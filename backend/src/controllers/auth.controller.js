const User = require('../models/User.model');
const { generateToken, generateRefreshToken, buildAuthResponse, getCookieOptions, getSecret } = require('../utils/jwt.util');
const sendEmail = require('../services/email.service');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');

// @desc    Register user
// @route   POST /api/v1/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists', data: null, access_token: null, refresh_token: null });
    }

    const user = await User.create({
      name,
      email,
      password,
      role, // Ideally restrict role assignment in production
    });

    const otp = user.getOtpCode();
    await user.save({ validateBeforeSave: false });

    // Send email with OTP
    try {
      await sendEmail({
        email: user.email,
        subject: 'Email Verification OTP',
        message: `Your OTP is ${otp}. It will expire in 10 minutes.`,
      });
    } catch (err) {
      console.error(err);
      user.otpCode = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }

    res.status(201).json({
      success: true,
      message: 'User registered, check your email for OTP',
      data: user,
      access_token: null,
      refresh_token: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Verify OTP
// @route   POST /api/v1/auth/verify-otp
// @access  Public
exports.verifyOtp = async (req, res, next) => {
  try {
    const { email, otpCode } = req.body;

    const hashedOtp = crypto.createHash('sha256').update(otpCode).digest('hex');

    const user = await User.findOne({
      email,
      otpCode: hashedOtp,
      otpExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired OTP', data: null, access_token: null, refresh_token: null });
    }

    user.isVerified = true;
    user.otpCode = undefined;
    user.otpExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Resend OTP
// @route   POST /api/v1/auth/resend-otp
// @access  Public
exports.resendOtp = async (req, res, next) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = user.getOtpCode();
    await user.save({ validateBeforeSave: false });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Resend: Email Verification OTP',
        message: `Your new OTP is ${otp}. It will expire in 10 minutes.`,
      });
      res.status(200).json({ success: true, message: 'OTP resent to email' });
    } catch (err) {
      console.error(err);
      user.otpCode = undefined;
      user.otpExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Login user
// @route   POST /api/v1/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide an email and password', data: null, access_token: null, refresh_token: null });
    }

    const user = await User.findOne({
      $or: [{ email: email }, { name: email }]
    }).select('+password');

    if (!user) {
      return res.status(401).json({ success: false, message: `User not found with identifier: ${email}`, data: null, access_token: null, refresh_token: null });
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: `Password mismatch for user: ${user.email}`, data: null, access_token: null, refresh_token: null });
    }
    
    if(!user.isVerified){
      return res.status(401).json({ success: false, message: 'Please verify your email first', requiresVerification: true, data: null, access_token: null, refresh_token: null });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Get current logged in user
// @route   GET /api/v1/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      message: 'User fetched successfully',
      data: user,
      access_token: null,
      refresh_token: null,
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Log user out / clear cookie
// @route   GET /api/v1/auth/logout
// @access  Private
exports.logout = async (req, res, next) => {
  const clearOptions = {
    ...getCookieOptions(process.env.NODE_ENV === 'production', 0),
    expires: new Date(0),
  };

  res
    .clearCookie('token', clearOptions)
    .clearCookie('refresh_token', clearOptions)
    .status(200)
    .json({
      success: true,
      message: 'Logged out successfully',
      data: null,
      access_token: null,
      refresh_token: null,
    });
};

// @desc    Forgot password
// @route   POST /api/v1/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'There is no user with that email', data: null, access_token: null, refresh_token: null });
    }

    const resetToken = user.getResetPasswordToken();
    await user.save({ validateBeforeSave: false });

    // Create reset url pointing to the user-facing frontend
    const resetUrl = `${process.env.FRONTEND_USER_URL}/reset-password/${resetToken}`;

    const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password reset token',
        message,
      });

      res.status(200).json({ success: true, message: 'Email sent', data: null, access_token: null, refresh_token: null });
    } catch (err) {
      console.error(err);
      user.resetPasswordToken = undefined;
      user.resetPasswordExpire = undefined;
      await user.save({ validateBeforeSave: false });
      return res.status(500).json({ success: false, message: 'Email could not be sent' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Reset password
// @route   PUT /api/v1/auth/reset-password/:resettoken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resettoken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token', data: null, access_token: null, refresh_token: null });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (error) {
    next(error);
  }
};

// @desc    Refresh token
// @route   POST /api/v1/auth/refresh-token
// @access  Public
exports.refreshToken = async (req, res, next) => {
  try {
    const { refresh_token } = req.cookies;
    
    if (!refresh_token) {
      return res.status(401).json({ success: false, message: 'No refresh token provided', data: null, access_token: null, refresh_token: null });
    }

    // Verify token
    const decoded = jwt.verify(refresh_token, getSecret('JWT_REFRESH_SECRET', 'dev-refresh-secret'));
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found', data: null, access_token: null, refresh_token: null });
    }

    sendTokenResponse(user, 200, res);
  } catch (error) {
    return res.status(401).json({ success: false, message: 'Invalid or expired refresh token', data: null, access_token: null, refresh_token: null });
  }
};

// Helper: Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = generateToken(user._id);
  const refreshToken = generateRefreshToken(user._id);

  const options = getCookieOptions(process.env.NODE_ENV === 'production', 30 * 24 * 60 * 60 * 1000);

  res
    .status(statusCode)
    .cookie('token', token, options)
    .cookie('refresh_token', refreshToken, options)
    .json(buildAuthResponse(user, token, refreshToken, 'Authentication successful'));
};

// @desc    Update password
// @route   PUT /api/v1/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select('+password');

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    if (req.body.currentPassword) {
      const isMatch = await user.matchPassword(req.body.currentPassword);
      if (!isMatch) {
        return res.status(401).json({ success: false, message: 'વર્તમાન પાસવર્ડ ખોટો છે.', data: null, access_token: null, refresh_token: null });
      }
    }

    user.password = req.body.newPassword;
    await user.save();

    res.status(200).json({ success: true, message: 'पासવર્ડ सफलતાપૂર્વક અપડેટ થયો!', data: null, access_token: null, refresh_token: null });
  } catch (error) {
    next(error);
  }
};
