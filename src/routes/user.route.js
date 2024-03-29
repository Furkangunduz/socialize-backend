const { Router } = require('express');
const { getUser, followUser, unfollowUser, updateProfile, deleteProfile } = require('../controllers/user.controller.js');
const { verifyToken } = require('../middlewares/jwtVerify.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { getUserSchema, followUserSchema, updateProfileSchema, deleteProfileSchema } = require('../schemas/user.schema.js');
const { uploadSingleFile } = require('../middlewares/fileUpload.middleware');

const router = Router();

router.get('/get-user', verifyToken, validateRequest(getUserSchema), getUser);

router.post('/follow-user', verifyToken, validateRequest(followUserSchema), followUser);

router.post('/unfollow-user', verifyToken, validateRequest(followUserSchema), unfollowUser);

router.post('/update-profile', verifyToken, validateRequest(updateProfileSchema), uploadSingleFile, updateProfile);

router.post('/delete-profile', verifyToken, validateRequest(deleteProfileSchema), deleteProfile);

module.exports = router;
