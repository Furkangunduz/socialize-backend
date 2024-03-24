const { Router } = require('express');
const { emailtest } = require('../controllers/emailtest.controller.js');

const router = Router();

router.route('/').post(emailtest);

module.exports = router;
