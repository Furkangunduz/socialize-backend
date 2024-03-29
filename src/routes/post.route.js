const { Router } = require('express');
const { authenticate } = require('../middlewares/authenticateUser.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { createPostSchema, getPostSchema } = require('../schemas/post.schema.js');
const { createPost, getPost } = require('../controllers/post.controller.js');

const router = Router();

router.post('/create-post', authenticate, validateRequest(createPostSchema), createPost);

router.get('/get-post', authenticate, validateRequest(getPostSchema), getPost);

module.exports = router;
