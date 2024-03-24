const { ApiError } = require('../helpers/ApiError.js');
const { ApiResponse } = require('../helpers/ApiResponse.js');
const { asyncHandler } = require('../helpers/asyncHandler.js');
const { User } = require('../models/user.model.js');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { createOtp } = require('../helpers/Otp.js');
const { sendMail } = require('../services/email.service.js');

const register = asyncHandler(async function (req, res) {
  try {
    const { username, email, password } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const existingUser = await User.findOne({
      $or: [{ username }, { email }],
    });

    if (existingUser) {
      return res.status(400).json(new ApiError(400, null, 'User already exists'));
    }

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

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

    const otp = await createOtp(userWithoutPassword);

    if (!otp) {
      return res.status(500).json(new ApiError(500, null, 'Could not generate OTP'));
    }

    sendMail({
      to: userWithoutPassword.email,
      subject: 'Your OTP',
      text: `Your OTP is ${otp.otp}`,
    });
    res.status(200).json(new ApiResponse(200, null, 'OTP sent to email successfully'));
  } catch (error) {
    res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = {
  register,
  login,
};
