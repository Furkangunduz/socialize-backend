const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticateUser.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { createPostSchema, getPostSchema, deletePostSchema, updatePostSchema } = require('../schemas/post.schema.js');
const { addCommentSchema, deleteCommentSchema } = require('../schemas/comment.schema.js');
const {
  createPost,
  getPost,
  getAllMyPosts,
  deletePost,
  updatePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} = require('../controllers/post.controller.js');

const router = Router();

router.post('/create-post', authenticate, validateRequest(createPostSchema), createPost);

router.get('/get-post', authenticate, validateRequest(getPostSchema), getPost);

router.get('/get-all-my-posts', authenticate, getAllMyPosts);

router.delete('/delete-post', authenticate, validateRequest(deletePostSchema), deletePost);

router.put('/update-post', authenticate, validateRequest(updatePostSchema), updatePost);

router.put('/like-post', authenticate, validateRequest(getPostSchema), likePost);

router.put('/unlike-post', authenticate, validateRequest(getPostSchema), unlikePost);

module.exports = router;
