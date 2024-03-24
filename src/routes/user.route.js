const { Router } = require('express');
const { register, login } = require('../controllers/user.controller.js');
const { loginSchema, registerSchema } = require('../schemas/user.schema.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');

const router = Router();

router.post('/register', validateRequest(registerSchema), register);

router.post('/login', validateRequest(loginSchema), login);

module.exports = router;
