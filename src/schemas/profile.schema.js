const joi = require('joi');

const followUserSchema = joi.object({
  followingUserId: joi.string().required(),
});

module.exports = { followUserSchema };
