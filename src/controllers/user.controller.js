const { ApiError } = require('../helpers/ApiError.js');
const { ApiResponse } = require('../helpers/ApiResponse.js');
const { asyncHandler } = require('../helpers/asyncHandler.js');
const { User } = require('../models/user.model.js');
const { createOtp } = require('../helpers/otp.helper.js');
const { sendMail } = require('../helpers/email/sendEmail.js');
const { ResetToken } = require('../models/resetToken.model');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Otp } = require('../models/otp.model.js');

const register = asyncHandler(async function (req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = bcrypt.hash(password, process.env.SALT);

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json(new ApiError(400, null, 'User already exists'));
    }

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    const otp = await createOtp(userWithoutPassword);

    if (!otp) {
      return res.status(500).json(new ApiError(500, null, 'Could not generate OTP'));
    }

    const link = `${process.env.CLIENT_URL}/otp?otp=${otp.otp}&userId=${userWithoutPassword._id}`;

    sendMail({
      to: userWithoutPassword.email,
      subject: 'Please Confirm Your Email Address',
      text: `Hello ${userWithoutPassword.username}, click on this link to confirm your email address: ${link}`,
    });

    res.status(200).json(new ApiResponse(200, null, 'Registration successful'));
  } catch (error) {
    res.status(500).json(new ApiError(500, 'Registration failed', error));
  }
});

const login = asyncHandler(async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(new ApiError(401, null, 'Could not find user with that email'));
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json(new ApiError(401, null, 'Password does not match'));
    }

    const token = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: '1d',
    });

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json(new ApiResponse(200, { ...userWithoutPassword, token }, 'OTP sent to email successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

const verifyEmail = asyncHandler(async function (req, res) {
  try {
    const { otp } = req.body;

    const verifiedOtp = await Otp.findOne({ otp });

    if (!verifiedOtp) {
      return res.status(400).json(new ApiResponse(400, null, 'Invalid OTP'));
    }

    await User.findByIdAndUpdate(verifiedOtp.userId, { isEmailVerified: true });

    const user = await User.findById(verifiedOtp.userId);

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    await Otp.deleteOne({
      otp,
    });

    res.status(200).json(new ApiResponse(200, { ...userWithoutPassword, token: verifiedOtp.token }, 'Email verified successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

const requestPasswordReset = asyncHandler(async function (req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(new ApiError(400, null, 'User does not exist'));
    }

    let token = await ResetToken.findOne({ userId: user._id });

    if (token) {
      await token.deleteOne();
    }

    let resetToken = crypto.randomBytes(32).toString('hex');
    const hash = await bcrypt.hash(resetToken, Number(process.env.SALT));

    await new ResetToken({
      userId: user._id,
      token: hash,
      createdAt: Date.now(),
    }).save();

    const link = `${process.env.CLIENT_URL}/passwordReset?token=${resetToken}&userId=${user._id}`;

    sendMail({
      to: user.email,
      subject: 'Password Reset Request',
      text: `Hello ${user.username}, click on this link to reset your password: ${link}`,
    });

    res.status(200).json(new ApiResponse(200, null, 'Password reset link sent to email successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

const resetPassword = asyncHandler(async function (req, res) {
  try {
    const { userId, token, password } = req.body;

    const resetToken = await ResetToken.findOne({ userId });

    if (!resetToken) {
      return res.status(400).json(new ApiError(400, null, 'Invalid or expired reset token'));
    }

    const isValid = await bcrypt.compare(token, resetToken.token);

    if (!isValid) {
      return res.status(400).json(new ApiError(400, null, 'Invalid or expired reset token'));
    }

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT));

    await User.updateOne({ _id: userId }, { $set: { password: hashedPassword } }, { new: true });

    const user = await User.findById(userId);

    sendMail({
      to: user.email,
      subject: 'Password Reset Successful',
      text: 'Your password has been reset successfully',
    });

    await resetToken.deleteOne();

    res.status(200).json(new ApiResponse(200, null, 'Password reset successful'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = {
  register,
  login,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
};
