const { ApiResponse } = require('../helpers/ApiResponse');
const { asyncHandler } = require('../helpers/asyncHandler');
const { Otp } = require('../models/otp.model.js');
const { User } = require('../models/user.model');

const otpVerify = asyncHandler(async (req, res) => {
  const { otp } = req.body;

  const verifiedOtp = await Otp.findOne({ otp });

  if (!verifiedOtp) {
    return res.status(400).json(new ApiResponse(400, null, 'Invalid OTP'));
  }

  const user = await User.findOne({ email: verifiedOtp.email });

  if (!user) {
    return res.status(400).json(new ApiResponse(400, null, 'User not found'));
  }

  const userWithoutPassword = user.toObject();
  delete userWithoutPassword.password;

  res.status(200).json(new ApiResponse(200, { ...userWithoutPassword, token: verifiedOtp.token }, 'OTP verified successfully'));
});

module.exports = {
  otpVerify,
};
