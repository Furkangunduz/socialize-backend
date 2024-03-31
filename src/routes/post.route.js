const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticateUser.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { createPostSchema, getPostSchema, deletePostSchema, updatePostSchema, verifyPostSchema } = require('../schemas/post.schema.js');
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
  verifyPost,
  getFeed,
} = require('../controllers/post.controller.js');
const { checkRole } = require('../middlewares/checkRole.middleware.js');
const { roles } = require('../helpers/roles.helper.js');

const router = Router();

router.post('/create-post', authenticate, validateRequest(createPostSchema), createPost);

router.get('/get-post', authenticate, validateRequest(getPostSchema), getPost);

router.get('/get-all-my-posts', authenticate, getAllMyPosts);

router.delete('/delete-post', authenticate, validateRequest(deletePostSchema), deletePost);

router.put('/update-post', authenticate, validateRequest(updatePostSchema), updatePost);

router.put('/like-post', authenticate, validateRequest(getPostSchema), likePost);

router.put('/unlike-post', authenticate, validateRequest(getPostSchema), unlikePost);

router.post('/add-comment', authenticate, validateRequest(addCommentSchema), addComment);

router.delete('/delete-comment', authenticate, validateRequest(deleteCommentSchema), deleteComment);

router.put('/verify-post', authenticate, validateRequest(verifyPostSchema), checkRole([roles.admin, roles.mod]), verifyPost);

router.get('/feed', authenticate, getFeed);

module.exports = router;
