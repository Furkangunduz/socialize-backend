require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const userRouter = require('./routes/user.route.js');
const emailTest = require('./routes/emailtest.route.js');
const otpRouter = require('./routes/otp.route.js');

const app = express();
app.use(morgan('dev'));
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: '16kb' }));
app.use(express.urlencoded({ extended: true, limit: '16kb' }));
app.use(express.static('public'));

app.use('/api/v1/users', userRouter);
app.use('/api/v1/emailtest', emailTest);
app.use('/api/v1/otp', otpRouter);

module.exports = { app };
