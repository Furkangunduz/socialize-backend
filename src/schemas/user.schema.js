const joi = require('joi');

const getUserSchema = joi.object({
  userId: joi.string().required(),
});

module.exports = { getUserSchema };
