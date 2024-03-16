const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
    },
    followers: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    following: [
      {
        type: Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    location: {
      type: String,
    },
    bio: {
      type: String,
    },
    role: {
      type: String,
      enum: ['user', 'admin', 'mod'],
      default: 'user',
    },
    savedPosts: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Post',
      },
    ],
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const User = model('User', userSchema);

module.exports = { User };
