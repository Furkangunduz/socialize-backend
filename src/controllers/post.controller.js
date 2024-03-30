const { ApiError } = require('../helpers/ApiError');
const { ApiResponse } = require('../helpers/ApiResponse');
const { asyncHandler } = require('../helpers/asyncHandler');
const { Post } = require('../models/post.model');
const { createFileUrl } = require('../utils/index');

/**
 * @route POST /posts/create-post
 *
 * @param {String} req.body.content - The content of the post.
 * @param {Boolean} req.body.is_public - The visibility of the post.
 * @param {Array} req.files - The files attached to the post.
 */
const createPost = asyncHandler(async function (req, res) {
  try {
    const { content, is_public } = req.body;
    const files = req.files;

    let fileUrlsArray = [];

    if (files.length !== 0) {
      fileUrlsArray = files.map((file) => createFileUrl(req, file.filename));
    }
    const newPost = new Post({
      user_id: req.userId,
      content,
      files: fileUrlsArray,
      is_public,
    });

    await newPost.save();

    return res.status(201).json(new ApiResponse(201, newPost, 'Post created successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route GET /posts/get-post
 *
 * @param {String} req.query.postId - The ID of the post.
 */
const getPost = asyncHandler(async function (req, res) {
  try {
    const { postId } = req.query;

    const post = await Post.findById(postId);

    if (!post) {
      return res.status(404).json(new ApiError(404, null, 'Post not found'));
    }

    return res.status(200).json(new ApiResponse(200, post, 'Post found'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route GET /posts/get-all-my-posts
 */

const getAllMyPosts = asyncHandler(async function (req, res) {
  try {
    const posts = await Post.find({ user_id: req.userId });

    if (posts.length === 0) {
      return res.status(404).json(new ApiError(404, null, 'Posts not found'));
    }

    return res.status(200).json(new ApiResponse(200, posts, 'Posts found'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route DELETE /posts/delete-post
 *
 * @param {String} req.body.postId - The ID of the post.
 */
const deletePost = asyncHandler(async function (req, res) {
  try {
    const { postId } = req.body;

    const post = await Post.findOne({ _id: postId, user_id: req.userId });

    if (!post) {
      return res.status(404).json(new ApiError(404, null, 'Post not found'));
    }

    const deletedPost = await Post.findByIdAndDelete(postId, { new: true });

    return res.status(200).json(new ApiResponse(200, deletedPost, 'Post deleted successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route PUT /posts/update-post
 *
 * @param {String} req.body.postId - The ID of the post.
 * @param {String} req.body.content - The content of the post.
 * @param {Boolean} req.body.is_public - The visibility of the post.
 * @param {Array} req.files - The files attached to the post.
 */

const updatePost = asyncHandler(async function (req, res) {
  try {
    const { postId, content, is_public } = req.body;
    const files = req.files;

    const post = await Post.findOne({ _id: postId, user_id: req.userId });

    if (!post) {
      return res.status(404).json(new ApiError(404, null, 'Post not found'));
    }

    let fileUrlsArray = [];

    if (files.length !== 0) {
      fileUrlsArray = files.map((file) => createFileUrl(req, file.filename));
    }

    const updateData = {
      content,
      is_public,
      files: fileUrlsArray,
    };

    const updatedPost = await Post.findByIdAndUpdate(
      postId,
      {
        content,
        files: fileUrlsArray,
        is_public,
      },
      { new: true }
    );

    return res.status(200).json(new ApiResponse(200, updatedPost, 'Post updated successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route PUT /posts/like-post
 *
 * @param {String} req.body.postId - The ID of the post.
 */

const likePost = asyncHandler(async function (req, res) {
  try {
    const { postId } = req.body;

    const likedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        likes: { $ne: req.userId },
      },
      {
        $addToSet: { likes: req.userId },
      },
      { new: true }
    ).populate('user', 'username avatar');

    if (!likedPost) {
      return res.status(404).json(new ApiError(404, null, 'Post not found'));
    }

    return res.status(200).json(new ApiResponse(200, likedPost, 'Post liked successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

/**
 * @route PUT /posts/unlike-post
 * @param {String} req.body.postId - The ID of the post.
 */
const unlikePost = asyncHandler(async function (req, res) {
  try {
    const { postId } = req.body;

    const unlikedPost = await Post.findOneAndUpdate(
      {
        _id: postId,
        likes: req.userId,
      },
      {
        $pull: { likes: req.userId },
      },
      { new: true }
    ).populate('user', 'username avatar');

    if (!unlikedPost) {
      return res.status(404).json(new ApiError(404, null, 'Post not found'));
    }

    return res.status(200).json(new ApiResponse(200, unlikedPost, 'Post unliked successfully'));
  } catch (error) {
    return res.status(500).json(new ApiError(500, null, error.message));
  }
});

module.exports = { createPost, getPost, getAllMyPosts, deletePost, updatePost, likePost, unlikePost };
