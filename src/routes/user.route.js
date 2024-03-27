const { Router } = require('express');
const { getUser } = require('../controllers/user.controller.js');
const { verifyToken } = require('../middlewares/jwtVerify.middleware.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');
const { getUserSchema } = require('../schemas/user.schema.js');

const router = Router();

router.get('/get-user', verifyToken, validateRequest(getUserSchema), getUser);

module.exports = router;
