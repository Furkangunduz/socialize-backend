const joi = require('joi');

const loginSchema = joi.object({
  email: joi.string().email().required(),
  password: joi
    .string()
    .required()
    .min(6)
    .max(20)
    .trim()
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .message('Password must be contain number and letters.'),
});

const registerSchema = joi.object({
  email: joi.string().email().required(),
  username: joi.string().required(),
  password: joi
    .string()
    .required()
    .min(6)
    .max(20)
    .trim()
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .message('Password must be contain number and letters.'),
});

module.exports = { loginSchema, registerSchema };
