const { Router } = require('express');
const { register, login, requestPasswordReset, resetPassword, verifyEmail } = require('../controllers/user.controller.js');
const { loginSchema, registerSchema, requestPasswordResetSchema, resetPasswordSchema, verifyEmailSchema } = require('../schemas/user.schema.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');

const router = Router();

router.post('/register', validateRequest(registerSchema), register);

router.post('/login', validateRequest(loginSchema), login);

router.post('/request-password-reset', validateRequest(requestPasswordResetSchema), requestPasswordReset);

router.post('/reset-password', validateRequest(resetPasswordSchema), resetPassword);

router.post('/verify-email', validateRequest(verifyEmailSchema), verifyEmail);

module.exports = router;
