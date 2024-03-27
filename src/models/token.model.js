const { Schema, model } = require('mongoose');

const token = new Schema({
  token: {
    type: String,
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Token = model('token', token);

module.exports = { Token };
