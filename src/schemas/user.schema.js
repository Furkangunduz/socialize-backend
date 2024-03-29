const joi = require('joi');

const getUserSchema = joi.object({
  userId: joi.string().required(),
});

const followUserSchema = joi.object({
  followingUserId: joi.string().required(),
});

const updateProfileSchema = joi.object({
  username: joi.string(),
  email: joi.string().email(),
  avatar: joi.string(),
  bio: joi.string(),
  website: joi.string().uri(),
  birthday: joi.date(),
});

const deleteProfileSchema = joi.object({
  password: joi.string().required(),
  confirmPassword: joi.string().required(),
});

module.exports = { getUserSchema, followUserSchema, updateProfileSchema, deleteProfileSchema };
