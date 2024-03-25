const jwt = require('jsonwebtoken');
const User = require('../models/user.model.js');
const { ApiError } = require('../helpers/ApiError');

async function verifyToken(req, res, next) {
  const token = req.header('Authorization');
  if (!token) return res.status(401).json(new ApiError(401, null, 'Token not provided'));

  try {
    const decoded = jwt.verify(token, process.env.SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return res.status(401).json(new ApiError(401, null, 'User not found by provided token'));
    }

    req.user = user;

    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res.status(401).json(new ApiError(401, null, 'Token expired'));
    }

    res.status(401).json(new ApiError(401, null, 'Invalid token'));
  }
}

module.exports = { verifyToken };
