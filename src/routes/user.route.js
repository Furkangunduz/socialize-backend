const { Router } = require('express');
const { register, login, requestPasswordReset, resetPassword } = require('../controllers/user.controller.js');
const { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema } = require('../schemas/user.schema.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');

const router = Router();

router.post('/register', validateRequest(registerSchema), register);

router.post('/login', validateRequest(loginSchema), login);

router.post('/request-password-reset', validateRequest(requestPasswordResetSchema), requestPasswordReset);

router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

module.exports = router;
