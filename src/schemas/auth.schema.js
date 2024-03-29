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
  passwordConfirmation: joi.any().equal(joi.ref('password')).required(),
});

const verifyEmailSchema = joi.object({
  otp: joi.string().required(),
});

const requestPasswordResetSchema = joi.object({
  email: joi.string().email().required(),
});

const resetPasswordSchema = joi.object({
  password: joi
    .string()
    .required()
    .min(6)
    .max(20)
    .trim()
    .pattern(new RegExp('^(?=.*[a-zA-Z])(?=.*[0-9])'))
    .message('Password must be contain number and letters.'),
  tokenId: joi.string().required(),
});

module.exports = { loginSchema, registerSchema, verifyEmailSchema, requestPasswordResetSchema, resetPasswordSchema };
