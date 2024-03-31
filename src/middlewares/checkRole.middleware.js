const { ApiError } = require('../helpers/ApiError');
const { User } = require('../models/user.model');

const checkRole = (roles) => async (req, res, next) => {
  const { userId } = req;

  const user = await User.findById(userId);

  if (!user) {
    return res.status(401).json(new ApiError(401, null, 'Unauthorized'));
  }

  if (!roles.includes(user.role)) {
    return res.status(403).json(new ApiError(403, null, 'You are not authorized to access this operation'));
  }
};

module.exports = { checkRole };
