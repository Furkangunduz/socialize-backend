const otpGenerator = require('otp-generator');
const { Otp } = require('../models/otp.model.js');

async function createOtp(user) {
  return new Promise(async (resolve, reject) => {
    try {
      const otp = otpGenerator.generate(5, {
        digits: true,
      });
      if (!otp) reject('Could not generate OTP');

      const existingOtp = await Otp.findOne({ userId: user._id });

      if (existingOtp) {
        existingOtp.otp = otp;
        await existingOtp.save();

        resolve(existingOtp);
      }

      const newOtp = new Otp({ userId: user._id, otp });
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
