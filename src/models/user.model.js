const bcrypt = require('bcrypt');
const { Schema, model } = require('mongoose');

const userSchema = new Schema(
  {
    email: {
      type: String,
      unique: true,
      required: true,
    },
    username: {
      type: String,
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
    birthday: {
      type: Date,
    },
    website: {
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
    deletedAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

//compare password
userSchema.methods.comparePassword = async function (password) {
  return bcrypt.compare(password, this.password);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  const hash = bcrypt.hash(this.password, 10);
  this.password = hash;
  next();
});

const User = model('User', userSchema);

module.exports = { User };
