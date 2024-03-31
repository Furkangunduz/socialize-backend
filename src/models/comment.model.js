const { Schema, model } = require('mongoose');

const commentSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    post_id: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'Post',
    },
    content: {
      type: String,
      required: true,
    },
  },
  { timestamps: true }
);

const Comment = model('Comment', commentSchema);

module.exports = { Comment };
