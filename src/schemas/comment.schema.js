const joi = require('joi');

const addCommentSchema = joi.object({
  postId: joi.string().required(),
  content: joi.string().required(),
});

const deleteCommentSchema = joi.object({
  commentId: joi.string().required(),
});

module.exports = {
  addCommentSchema,
  deleteCommentSchema,
};
