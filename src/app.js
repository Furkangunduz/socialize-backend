require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const multer = require('multer');

const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/user.route.js');

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
app.use('/assets', express.static('assets'));

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);

module.exports = { app };
