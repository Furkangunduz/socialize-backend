require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');

const authRoute = require('./routes/auth.route.js');
const userRoute = require('./routes/user.route.js');
const postRoute = require('./routes/post.route.js');

const { uploadFile } = require('./middlewares/fileUpload.middleware.js');

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
app.use(uploadFile);

app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Welcome to Socialize API</title>
      <style>
        body {
          font-family: Arial, sans-serif;
          background-color: #f8f9fa;
          margin: 0;
          padding: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100vh;
        }
        .container {
          text-align: center;
          background-color: #ffffff;
          padding: 20px;
          border-radius: 8px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        h1 {
          color: #007bff;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>Welcome to Socialize API</h1>
      </div>
    </body>
    </html>
  `);
});

app.use('/api/v1/auth', authRoute);
app.use('/api/v1/users', userRoute);
app.use('/api/v1/posts', postRoute);

module.exports = { app };
