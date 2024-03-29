const joi = require('joi');

const createPostSchema = joi.object({
  content: joi.string().required(),
  files: joi.array().max(5).items(joi.string()),
  is_public: joi.boolean(),
});

const getPostSchema = joi.object({
  postId: joi.string().required(),
});

module.exports = { createPostSchema, getPostSchema };
