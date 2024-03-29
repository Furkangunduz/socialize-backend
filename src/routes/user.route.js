const { Router } = require('express');
const { getUser, followUser, unfollowUser, updateProfile, deleteProfile } = require('../controllers/user.controller.js');
const { authenticate } = require('../middlewares/authenticateUser.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { getUserSchema, followUserSchema, updateProfileSchema, deleteProfileSchema } = require('../schemas/user.schema.js');

const router = Router();

router.get('/get-user', authenticate, validateRequest(getUserSchema), getUser);

router.post('/follow-user', authenticate, validateRequest(followUserSchema), followUser);

router.post('/unfollow-user', authenticate, validateRequest(followUserSchema), unfollowUser);

router.put('/update-profile', authenticate, validateRequest(updateProfileSchema), updateProfile);

router.delete('/delete-profile', authenticate, validateRequest(deleteProfileSchema), deleteProfile);

module.exports = router;
