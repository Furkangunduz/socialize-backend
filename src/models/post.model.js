const { Schema, model } = require('mongoose');

const PostSchema = new Schema(
  {
    user: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    content: {
      type: String,
      required: true,
    },
    files: {
      type: [String],
    },
    likes: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'User',
    },
    comments: {
      type: [Schema.Types.ObjectId],
      default: [],
      ref: 'Comment',
    },
    view_count: {
      type: Number,
      default: 0,
    },
    is_pending: {
      type: Boolean,
      default: true,
    },
    is_public: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

const Post = model('Post', PostSchema);

module.exports = { Post };
