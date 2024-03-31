const joi = require('joi');

const createPostSchema = joi.object({
  content: joi.string().required(),
  files: joi.array().max(5).items(joi.string()),
  is_public: joi.boolean(),
});

const getPostSchema = joi.object({
  postId: joi.string().required(),
});

const deletePostSchema = joi.object({
  postId: joi.string().required(),
});

const updatePostSchema = joi.object({
  postId: joi.string().required(),
  content: joi.string(),
  files: joi.array().max(5).items(joi.string()),
  is_public: joi.boolean(),
});

const verifyPostSchema = joi.object({
  postId: joi.string().required(),
});

module.exports = { createPostSchema, getPostSchema, deletePostSchema, updatePostSchema, verifyPostSchema };
