const { ApiError } = require('../helpers/ApiError.js');
const { ApiResponse } = require('../helpers/ApiResponse.js');
const { asyncHandler } = require('../helpers/asyncHandler.js');
const { createOtp } = require('../helpers/otp.helper.js');
const { sendMail } = require('../helpers/email/sendEmail.js');

const { User } = require('../models/user.model.js');
const { ResetToken } = require('../models/resetToken.model.js');
const { Otp } = require('../models/otp.model.js');
const { Token } = require('../models/token.model.js');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

/**
 * @route POST /users/register
 *
 * @param {String} req.body.email - The email of the user.
 * @param {String} req.body.username - The username of the user.
 * @param {String} req.body.password - The password of the user.
 * @param {String} req.body.confirmPassword - The password confirmation of the user.
 */

const register = asyncHandler(async function (req, res) {
  try {
    const { username, email, password, confirmPassword } = req.body;

    if (password !== confirmPassword) {
      return res.status(400).json(new ApiError(400, null, 'Passwords do not match'));
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ email }],
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

/**
 * @route POST /users/login
 *
 * @param {String} req.body.email - The email of the user.
 * @param {String} req.body.password - The password of the user.
 *
 */
const login = asyncHandler(async function (req, res) {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json(new ApiError(401, null, 'Could not find user with that email'));
    }

    const passwordMatch = await user.comparePassword(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json(new ApiError(401, null, 'Password does not match'));
    }

    const jwtToken = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: '1d',
    });

    const token = new Token({ token: jwtToken, userId: user._id });
    await token.save();

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json(new ApiResponse(200, { ...userWithoutPassword, token: jwtToken }, 'OTP sent to email successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route POST /users/me
 *
 */

const me = asyncHandler(async function (req, res) {
  try {
    const token = req.headers.authorization.split(' ')[1];
    if (!token) return res.status(401).json(new ApiError(401, null, 'Token not provided'));

    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(404).json(new ApiError(404, null, 'User not found'));
    }

    const userWithoutPassword = user.toObject();
    delete userWithoutPassword.password;

    res.status(200).json(new ApiResponse(200, userWithoutPassword, 'User found'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route POST /users/verify-email
 *
 * @param {String} req.body.otp - The OTP sent to the user's email.
 */
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

/**
 * @route POST /users/request-password-reset
 *
 * @param {String} req.body.email - The email of the user.
 */
const requestPasswordReset = asyncHandler(async function (req, res) {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json(new ApiError(400, null, 'User does not exist'));
    }

    let existingToken = await ResetToken.findOne({ userId: user._id });

    if (existingToken) {
      await existingToken.deleteOne();
    }

    const resetJwt = jwt.sign({ userId: user._id }, process.env.SECRET, {
      expiresIn: '1h',
    });

    const token = new ResetToken({
      userId: user._id,
      token: resetJwt,
      createdAt: Date.now(),
    });
    await token.save();

    const link = `${process.env.CLIENT_URL}/passwordReset?tokenId=${token._id}&userId=${user._id}`;

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

/**
 *  @route POST /users/reset-password
 *
 * @param {String} req.body.token - The reset token.
 * @param {String} req.body.password - The new password.
 */
const resetPassword = asyncHandler(async function (req, res) {
  try {
    const { tokenId, password } = req.body;

    const resetToken = await ResetToken.findById(tokenId);

    if (!resetToken) {
      return res.status(400).json(new ApiError(400, null, 'Invalid or expired reset token'));
    }

    const isValid = jwt.verify(resetToken.token, process.env.SECRET);

    if (!isValid) {
      return res.status(400).json(new ApiError(400, null, 'Invalid or expired reset token'));
    }

    const hashedPassword = await bcrypt.hash(password, Number(10));

    await User.updateOne({ _id: resetToken.userId }, { $set: { password: hashedPassword } }, { new: true });

    const user = await User.findById(resetToken.userId);

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
  me,
  requestPasswordReset,
  resetPassword,
  verifyEmail,
};
