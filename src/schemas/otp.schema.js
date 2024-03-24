const joi = require('joi');

const otpSchema = joi.object({
  otp: joi.string().required(),
});

module.exports = { otpSchema };
