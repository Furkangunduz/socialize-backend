const { Router } = require('express');
const { otpVerify } = require('../controllers/Otp.controller.js');
const { otpSchema } = require('../schemas/otp.schema.js');
const { validateRequest } = require('../middlewares/validateRequest.middleware.js');

const router = Router();

router.post('/verify', validateRequest(otpSchema), otpVerify);

module.exports = router;
