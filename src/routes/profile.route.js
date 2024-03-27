const { Router } = require('express');
const { followUser } = require('../controllers/profile.controller.js');
const { verifyToken } = require('../middlewares/jwtVerify.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { followUserSchema } = require('../schemas/profile.schema.js');

const router = Router();

router.post('/follow-user', verifyToken, validateRequest(followUserSchema), followUser);

module.exports = router;
