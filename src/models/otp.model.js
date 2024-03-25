const { Schema, model } = require('mongoose');

const otpSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
    expires: 60 * 10,
  },
});

const Otp = model('Otp', otpSchema);

module.exports = { Otp };
