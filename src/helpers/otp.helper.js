const otpGenerator = require('otp-generator');
const otpModel = require('../models/otp.model.js');

async function createOtp(user, token) {
  return new Promise(async (resolve, reject) => {
    try {
      const otp = otpGenerator.generate(6, { upperCase: false, specialChars: false });
      const newOtp = new otpModel({ email: user.email, otp, token });
      await newOtp.save();

      resolve(newOtp);
    } catch (error) {
      reject(error);
    }
  });
}

module.exports = {
  createOtp,
};
