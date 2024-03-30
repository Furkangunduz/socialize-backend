const { Router } = require('express');
const router = Router();

const authRoute = require('./auth.route.js');
const userRoute = require('./user.route.js');
const postRoute = require('./post.route.js');

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/posts', postRoute);

module.exports = router;
