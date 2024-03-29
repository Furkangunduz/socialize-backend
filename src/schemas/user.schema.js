const joi = require('joi');

const getUserSchema = joi.object({
  userId: joi.string().required(),
});

const followUserSchema = joi.object({
  followingUserId: joi.string().required(),
});

module.exports = { getUserSchema, followUserSchema };
