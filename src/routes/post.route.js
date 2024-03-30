const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticateUser.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { createPostSchema, getPostSchema, deletePostSchema, updatePostSchema } = require('../schemas/post.schema.js');
const { createPost, getPost, deletePost, updatePost } = require('../controllers/post.controller.js');

const router = Router();

router.post('/create-post', authenticate, validateRequest(createPostSchema), createPost);

router.get('/get-post', authenticate, validateRequest(getPostSchema), getPost);

router.delete('/delete-post', authenticate, validateRequest(deletePostSchema), deletePost);

router.put('/update-post', authenticate, validateRequest(updatePostSchema), updatePost);

module.exports = router;
