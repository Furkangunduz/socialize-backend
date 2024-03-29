const { Router } = require('express');
const { getUser, followUser, unfollowUser } = require('../controllers/user.controller.js');
const { verifyToken } = require('../middlewares/jwtVerify.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { getUserSchema } = require('../schemas/user.schema.js');
const { followUserSchema } = require('../schemas/profile.schema.js');

const router = Router();

router.get('/get-user', verifyToken, validateRequest(getUserSchema), getUser);

router.post('/follow-user', verifyToken, validateRequest(followUserSchema), followUser);

router.post('/unfollow-user', verifyToken, validateRequest(followUserSchema), unfollowUser);

module.exports = router;
