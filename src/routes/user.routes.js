const { Router } = require('express');
const { registerUser } = require('../controllers/user.controller.js');
const { userSchema } = require('../schemas/user.schema.js');
const {
  validateRequest,
} = require('../middlewares/validateRequest.middleware.js');

const router = Router();

router
  .route('/register')
  .post(validateRequest({ schema: userSchema }), registerUser);

module.exports = router;
