const jwt = require('jsonwebtoken');
const { ApiError } = require('../helpers/ApiError');

async function verifyToken(req, res, next) {
  const token = req.headers.authorization.split(' ')[1];
  if (!token) return res.status(401).json(new ApiError(401, null, 'Token not provided'));

  try {
    const decoded = jwt.verify(token, process.env.SECRET);

    if (!decoded) {
      return res.status(401).json(new ApiError(401, null, 'Invalid token'));
    }

    req.userId = decoded.userId;

    next();
  } catch (error) {
    if (error.message === 'jwt expired') {
      return res.status(401).json(new ApiError(401, null, 'Token expired'));
    }

    res.status(401).json(new ApiError(401, null, 'Invalid token'));
  }
}

module.exports = { verifyToken };
